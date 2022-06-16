const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');
const { parse } = require('comment-json');
const globToRegExp = require('glob-to-regexp');
const lodash = require('lodash');

const ConfigurationRegistry = require('../../models/configurationregistry');
const { EnvironmentVariableParser } = require('../../utils/envvarparser');
const GeneratedData = require('../../models/generateddata');
const LocalFileParser = require('../../i18n/translationfetchers/localfileparser');
const LocalizationConfig = require('../../models/localizationconfig');
const PageTemplate = require('../../models/pagetemplate');
const PageUniquenessValidator = require('../../validation/pageuniquenessvalidator');
const PageWriter = require('./pagewriter');
const PartialsRegistry = require('../../models/partialsregistry');
const HandlebarsPreprocessor = require('../../handlebars/handlebarspreprocessor');
const { stripExtension, isValidFile, getPageName } = require('../../utils/fileutils');
const registerHbsHelpers = require('../../handlebars/registerhbshelpers');
const registerCustomHbsHelpers = require('../../handlebars/registercustomhbshelpers');
const SystemError = require('../../errors/systemerror');
const Translator = require('../../i18n/translator/translator');
const UserError = require('../../errors/usererror');
const { info, error } = require('../../utils/logger');
const UnknownError = require('../../errors/unknownerror');

class SitesGenerator {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Renders the static HTML for each site in the pages directory. All Handlebars
   * partials needed to do this are registered. Parameters, driven by the data in
   * any environment variables and the config directory, are supplied to these partials.
   *
   * @param {Array<string>} jsonEnvVars Those environment variables that were serialized
   *                                    using JSON.
   */
  async generate(jsonEnvVars = []) {
    const config = this.config;
    if (!config) {
      throw new UserError('Cannot find Jambo config in this directory, exiting.');
    }

    // Pull all data from environment variables.
    const envVarParser = EnvironmentVariableParser.create();
    const env = envVarParser.parse(['JAMBO_INJECTED_DATA'].concat(jsonEnvVars));
    info('Jambo Injected Data:', env['JAMBO_INJECTED_DATA']);

    info('Reading config files');
    const configNameToRawConfig = {};
    fs.recurseSync(config.dirs.config, (path, relative, filename) => {
      if (isValidFile(filename)) {
        let configName = stripExtension(relative);
        try {
          configNameToRawConfig[configName] = parse(
            fs.readFileSync(path, 'utf8'),
            null,
            true
          );
        } catch (err) {
          if (err instanceof SyntaxError ||
            err.message && err.message.includes('Invalid regular expression')
          ) {
            throw new UserError(
              `JSON syntax error found in page config at "${path}"`, err.stack);
          } else {
            throw new UnknownError(`Unable to parse json config at "${path}"`, err.stack);
          }
        }
      }
    });

    const configRegistry = ConfigurationRegistry.from(configNameToRawConfig);
    const hasLocalizationConfig = configRegistry.getLocalizationConfig().hasConfig();

    let pageTemplates = [];
    fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
      if (isValidFile(filename)) {
        const fileContents = fs.readFileSync(path).toString();
        pageTemplates.push(new PageTemplate({
          pageName: hasLocalizationConfig
            ? getPageName(filename)
            : stripExtension(stripExtension(filename)),
          fileContents: fileContents,
          path: path,
          locale: hasLocalizationConfig && PageTemplate.parseLocale(filename)
        }));
      }
    });

    info('Reading partial files');
    let partialRegistry;
    try {
      partialRegistry = PartialsRegistry.build({
        customPartialPaths: config.dirs.partials,
        themePath: `${config.dirs.themes}/${config.defaultTheme}`
      });
    } catch (err) {
      throw new UserError('Failed to build partials', err.stack);
    }

    // TODO (agrow) refactor sitesgenerator and pull this logic out of the class.
    const GENERATED_DATA = GeneratedData.from({
      globalConfig: configRegistry.getGlobalConfig(),
      localizationConfig: configRegistry.getLocalizationConfig(),
      pageConfigs: configRegistry.getPageConfigs(),
      pageTemplates: pageTemplates
    });

    const allPages = GENERATED_DATA.getPageSets()
      .flatMap(pageSet => pageSet.getPages());

    new PageUniquenessValidator().validate(allPages);

    // Clear the output directory but keep preserved files before writing new files
    info('Cleaning output directory');
    const shouldCleanOutput =
      fs.existsSync(config.dirs.output) &&
      !(this._isPreserved(config.dirs.output, config.dirs.preservedFiles));
    if (shouldCleanOutput) {
      this._clearDirectory(config.dirs.output, config.dirs.preservedFiles);
    }

    info('Creating static output directory');
    let staticDirs = [
      `${config.dirs.themes}/${config.defaultTheme}/static`,
      'static'
    ];
    this._createStaticOutput(staticDirs, config.dirs.output);

    info('Extracting translations');
    const locales = GENERATED_DATA.getLocales();
    const translations =
      await this._extractTranslations(locales, configRegistry.getLocalizationConfig());

    // Register built-in Jambo Handlebars helpers.
    info('Registering Jambo Handlebars helpers');
    try {
      registerHbsHelpers(hbs);
    } catch (err) {
      throw new SystemError('Failed to register jambo handlebars helpers', err.stack);
    }

    // Register the default theme's Handlebars helpers from the hbshelpers folder.
    const customHbsHelpersDir =
      path.resolve(config.dirs.themes, config.defaultTheme, 'hbshelpers')
    if (fs.existsSync(customHbsHelpersDir)) {
      try {
        info('Registering custom Handlebars helpers from the default theme');
        registerCustomHbsHelpers(hbs, customHbsHelpersDir);
      } catch (err) {
        throw new UserError('Failed to register custom handlebars helpers', err.stack);
      }
    }

    const pageSets = GENERATED_DATA.getPageSets();
    for (const pageSet of pageSets) {
      // Pre-process partials and register them with the Handlebars instance
      const locale = pageSet.getLocale();
      const translator = await Translator
        .create(locale, GENERATED_DATA.getLocaleFallbacks(locale), translations);
      const handlebarsPreprocessor = new HandlebarsPreprocessor(translator);

      info(`Registering Handlebars partials for locale ${locale}`);
      for (const partial of partialRegistry.getPartials()) {
        hbs.registerPartial(
          partial.getName(),
          handlebarsPreprocessor.process(partial.getFileContents())
        );
      }

      // Pre-process page template contents - these are not registered with the
      // Handlebars instance, the PageWriter compiles them with their args
      for (const page of pageSet.getPages()) {
        const processedTemplate = handlebarsPreprocessor.process(
          page.getTemplateContents());
        page.setTemplateContents(processedTemplate);
      }

      const templateDataFormatterHook = path.resolve(
        config.dirs.themes, config.defaultTheme, 'hooks', 'templatedataformatter.js');
      const templateDataValidationHook = path.resolve(
        config.dirs.themes, config.defaultTheme, 'hooks', 'templatedatavalidator.js');
      // Write pages
      new PageWriter({
        outputDirectory: config.dirs.output,
        templateDataFormatterHook: templateDataFormatterHook,
        templateDataValidationHook: templateDataValidationHook,
        env: env,
      }).writePages(pageSet);
    }

    info('Done.');
  }

  /**
   * Clears given directory by traversing the directory and removing unpreserved files.
   *
   * @param {string} filePath The path of a directory or file to be cleared.
   * @param {Array} preservedFiles List of glob wildcards of preserved files.
   */
  _clearDirectory(filePath, preservedFiles) {
    const stats = fs.statSync(filePath);
    if (stats.isFile() && !this._isPreserved(filePath, preservedFiles)) {
      fs.unlinkSync(filePath);
    }
    else if (stats.isDirectory()) {
      const fsNodes = fs.readdirSync(filePath);
      fsNodes.forEach(fsNode => {
        const fsNodePath = path.join(filePath, fsNode);
        if (!this._isPreserved(fsNodePath, preservedFiles)) {
          const fileStats = fs.statSync(fsNodePath);
          if (fileStats.isFile()) {
            fs.unlinkSync(fsNodePath);
          }
          else if (fileStats.isDirectory()) {
            if (this._containsPreservedFiles(fsNodePath, preservedFiles)) {
              this._clearDirectory(fsNodePath, preservedFiles);
            }
            else {
              fs.rmdirSync(fsNodePath);
            }
          }
        }
      });
    }
  }

  /**
   * Checks whether a file or directory matches a glob wildcard in list of
   * preserved files.
   *
   * @param {string} path The path of a directory or file.
   * @param {Array} preservedFiles List of glob wildcards of preserved files.
   */
  _isPreserved(path, preservedFiles) {
    if (path && preservedFiles) {
      return preservedFiles.some(wildcard => {
        const regex = globToRegExp(wildcard);
        return regex.test(path);
      });
    }
    return false;
  }

  /**
   * Recursively traverses a directory to check if it contains preserved files.
   *
   * @param {string} directory The path of a directory or file.
   * @param {Array} preservedFiles List of glob wildcards of preserved files.
   */
  _containsPreservedFiles(directory, preservedFiles) {
    let hasPreservedFile = false;
    if (preservedFiles) {
      fs.recurseSync(directory, (path, relative, filename) => {
        if (this._isPreserved(path, preservedFiles)) {
          hasPreservedFile = true;
        }
      });
    }
    return hasPreservedFile;
  }

  /**
   * Creates and populates static directory inside jambo output directory.
   *
   * @param {Array} staticDirs An array of paths for static directories, each
   *                           static directory's contents will be copied into the
   *                           output. Order matters; if there are conflicts,
   *                           files/directories from staticDirs later in the array
   *                           will overwrite the contents of earlier ones.
   * @param {string} outputDir The path of the jambo output directory; the
   *                           output will be written in [outputDir]/static
   */
  _createStaticOutput(staticDirs, outputDir) {
    for (let staticDir of staticDirs) {
      fs.recurseSync(staticDir, (path, relative, filename) => {
        if (fs.lstatSync(path).isFile()) {
          fs.copyFileSync(path, `${outputDir}/static/${relative}`);
        }
      });
    }
  }

  /**
   * Parses the local translation files for the provided locales.
   * Parses both custom and theme translations.
   * The translations are returned in i18next format.
   *
   * @param {Array<string>} locales The list of locales.
   * @param {LocalizationConfig} localizationConfig
   * @returns {Object<string, Object>} A map of locale to formatted translations.
   */
  async _extractTranslations(locales, localizationConfig) {
    const customTranslations = await this._extractCustomTranslations(
      locales, localizationConfig);
    const themeTranslations = await this._extractThemeTranslations(locales);
    const mergedTranslations = lodash.merge(themeTranslations, customTranslations);

    return mergedTranslations;
  }

  /**
   * Parses the local translation files for the provided locales.
   * Parses translations in the custom translations folder
   * The translations are returned in i18next format.
   *
   * @param {Array<string>} locales The list of locales.
   * @param {LocalizationConfig} localizationConfig
   * @returns {Object<string, Object>} A map of locale to formatted translations.
   */
  async _extractCustomTranslations(locales, localizationConfig) {
    const translationsDir = this.config.dirs.translations;

    if (!translationsDir) {
      return {};
    }

    const localFileParser = new LocalFileParser(translationsDir);
    const translations = {};

    for (const locale of locales) {
      const translationFileName =
        localizationConfig.getTranslationFile(locale) || `${locale}.po`;
      const translationFilePath = path.join(translationsDir, translationFileName);
      if (fs.existsSync(translationFilePath)) {
        const localeTranslations = await localFileParser
          .fetch(locale, translationFileName);
        translations[locale] = { translation: localeTranslations };
      }
    }

    return translations;
  }

  /**
   * Parses the local translation files for the provided locales.
   * Parses translations in the theme translations folder
   * The translations are returned in i18next format.
   *
   * @param {Array<string>} locales The list of locales.
   * @returns {Object<string, Object>} A map of locale to formatted translations.
   */
  async _extractThemeTranslations(locales) {
    const themeTranslationsDir =
      `${this.config.dirs.themes}/${this.config.defaultTheme}/translations`;
    const localFileParser = new LocalFileParser(themeTranslationsDir);
    const translations = {};

    for (const locale of locales) {
      const translationFileName = `${locale}.po`;
      const translationFilePath = path.join(themeTranslationsDir, translationFileName);
      if (fs.existsSync(translationFilePath)) {
        const localeTranslations = await localFileParser
          .fetch(locale, translationFileName);
        translations[locale] = { translation: localeTranslations };
      }
    }

    return translations;
  }
}

module.exports = SitesGenerator;
