const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');
const { parse } = require('comment-json');
const babel = require("@babel/core");
const globToRegExp = require('glob-to-regexp');
const _ = require('lodash');

const ConfigurationRegistry = require('../../models/configurationregistry');
const { EnvironmentVariableParser } = require('../../utils/envvarparser');
const GeneratedData = require('../../models/generateddata');
const PageTemplate = require('../../models/pagetemplate');
const PageWriter = require('./pagewriter');
const { stripExtension } = require('../../utils/fileutils');

exports.SitesGenerator = class {
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
  generate(jsonEnvVars=[]) {
    const config = this.config;
    if (!config) {
      throw new Error('Cannot find Jambo config in this directory, exiting.');
    }

    // Pull all data from environment variables.
    const envVarParser = EnvironmentVariableParser.create();
    const env = envVarParser.parse(['JAMBO_INJECTED_DATA'].concat(jsonEnvVars));
    console.log('Jambo Injected Data:', env);

    console.log('Reading config files');
    const configNameToRawConfig = {};
    fs.recurseSync(config.dirs.config, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        let configName = stripExtension(relative);
        try {
          configNameToRawConfig[configName] = parse(fs.readFileSync(path, 'utf8'), null, true);
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error('JSON SyntaxError: could not parse ' + path);
          } else {
            throw e;
          }
        }
      }
    });
    const configRegistry = new ConfigurationRegistry(configNameToRawConfig, config.dirs.config);

    let pageTemplates = [];
    fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        pageTemplates.push(new PageTemplate({
          path: path,
          filename: filename,
        }));
      }
    });

    const GENERATED_DATA = new GeneratedData({
      globalConfig: configRegistry.getGlobalConfig(),
      localizationConfig: configRegistry.getLocalizationConfig(),
      pageConfigs: configRegistry.getPageConfigs(),
      pageTemplates: pageTemplates
    });

    console.log('Registering Jambo Handlebars helpers');
    // Register needed Handlebars helpers.
    this._registerHelpers();

    console.log('Registering all handlebars templates');
    // Register Theme partials.
    const defaultTheme = config.defaultTheme;
    defaultTheme && this._registerThemePartials(defaultTheme, config.dirs.themes);

    // Register all custom partials.
    this._registerCustomPartials(config.dirs.partials);

    // Clear the output directory but keep preserved files before writing new files
    console.log('Cleaning output directory');
    if (fs.existsSync(config.dirs.output) && !(this._isPreserved(config.dirs.output, config.dirs.preservedFiles))) {
      this._clearDirectory(config.dirs.output, config.dirs.preservedFiles);
    }

    console.log('Creating static output directory');
    let staticDirs = [
      `${config.dirs.themes}/${config.defaultTheme}/static`,
      'static'
    ];
    this._createStaticOutput(staticDirs, config.dirs.output);

    for (let locale of GENERATED_DATA.getLocales()) {
      console.log(`Writing files for '${locale}' locale`);

      const pageSet = GENERATED_DATA.buildPageSet(locale);
      new PageWriter({
        partialsDirectory: config.dirs.partials,
        outputDirectory: config.dirs.output,
        env: env,
      }).writePages(pageSet);
    }

    console.log('Done.');
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
   * Checks whether a file or directory matches a glob wildcard in list of preserved files.
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
   * Registers all custom Handlebars partials in the provided paths.
   *
   * @param {Array} partialPaths The set of paths to traverse for partials.
   */
  _registerCustomPartials(partialPaths) {
    partialPaths.forEach(partialPath => this._registerPartials(partialPath, true));
  }

  /**
   * Registers all of the partials in the default Theme.
   *
   * @param {string} defaultTheme The default Theme in the Jambo config.
   * @param {string} themesDir The Jambo Themes directory.
   */
  _registerThemePartials(defaultTheme, themesDir) {
    const themeDir = path.resolve(themesDir, defaultTheme);
    this._registerPartials(themeDir, false);
  }

  /**
   * Registers all partials in the provided path. If the path is a directory,
   * the useFullyQualifiedName parameter dictates if the path's root will be
   * included in the partial naming scheme.
   *
   * @param {string} partialsPath The set of partials to register.
   * @param {boolean} useFullyQualifiedName Whether or not to include the path's root
   *                                        in the name of the newly registered partials.
   */
  _registerPartials(partialsPath, useFullyQualifiedName) {
    const pathExists = fs.existsSync(partialsPath);
    if (pathExists && !fs.lstatSync(partialsPath).isFile()) {
      fs.recurseSync(partialsPath, (path, relative, filename) => {
        if (this._isValidFile(filename)) {
          const partialName = useFullyQualifiedName
            ? stripExtension(path)
            : stripExtension(relative);
          hbs.registerPartial(partialName, fs.readFileSync(path).toString());
        }
      });
    } else if (pathExists) {
      hbs.registerPartial(
        stripExtension(partialsPath),
        fs.readFileSync(partialsPath).toString());
    }
  }

  _registerHelpers(translator) {
    hbs.registerHelper('json', function(context) {
      return JSON.stringify(context || {});
    });

    hbs.registerHelper('ifeq', function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper('read', function (fileName) {
      return hbs.partials[fileName];
    });

    hbs.registerHelper('babel', function(options) {
      const srcCode = options.fn(this);
      return babel.transformSync(srcCode, {
        compact: true,
        minified: true,
        presets: [
          '@babel/preset-env',
          ],
        }).code;
    })

    hbs.registerHelper('partialPattern', function (cardPath, opt) {
      let result = '';
      Object.keys(hbs.partials)
        .filter(key => key.match(new RegExp(cardPath)))
        .map(key => {return {key}})
        .forEach(key => result += opt.fn(key));
      return result;
    });

    /**
     * Performs a deep merge of the given objects.
     */
    hbs.registerHelper('deepMerge', function (...args) {
      return _.merge({}, ...args.slice(0, args.length - 1));
    });

    /**
     * Performs a simple translation of the provided phrase. Interpolation is
     * supported as well.
     */
    hbs.registerHelper('translate', function (phrase, options) {
      const interpValues = options.hash;
      return translator.translate(phrase, interpValues);
    });
  }

  _isValidFile(fileName) {
    return fileName && !fileName.startsWith('.');
  }
}
