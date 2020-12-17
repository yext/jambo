const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');
const UserError = require('../../errors/usererror');
const { NO_LOCALE } = require('../../constants');
const LocalizationConfig = require('../../models/localizationconfig');

/**
 * PageWriter is responsible for writing output files for the given {@link PageSet} to
 * the given output directory.
 */
module.exports = class PageWriter {
  constructor(config) {
    /**
     * @type {Object}
     */
    this._env = config.env;

    /**
     * @type {String}
     */
    this._outputDirectory = config.outputDirectory;

    /**
     * Absolute path to the template data hook, if one is given.
     * 
     * @type {String|undefined}
     */
    this._templateDataFormatter = config.templateDataFormatter;
  }

  /**
   * Writes a file to the output directory per page in the given PageSet.
   *
   * @param {PageSet} pageSet the collection of pages to generate
   */
  writePages(pageSet) {
    if (!pageSet || pageSet.getPages().length < 1) {
      return;
    }
    const localeMessage = pageSet.getLocale() !== NO_LOCALE
      ? ` for '${pageSet.getLocale()}' locale`
      : '';
    console.log(`Writing files${localeMessage}`);

    const pageSetData = {
      currentLocaleConfig: pageSet.getCurrentLocaleConfig(),
      globalConfig: pageSet.getGlobalConfig().getConfig(),
      pageNameToConfig: pageSet.getPageNameToConfig(),
      locale: pageSet.getLocale()
    };

    for (const page of pageSet.getPages()) {
      if (!page.getConfig()) {
        throw new UserError(`Error: No config found for page: ${page.getName()}`);
      }

      console.log(`Writing output file for the '${page.getName()}' page`);
      const templateArguments = this._buildArgsForTemplate({
        pageConfig: page.getConfig(),
        relativePath: this._calculateRelativePath(page.getOutputPath()),
        pageName: page.getName(),
        ...pageSetData
      });

      const template = hbs.compile(page.getTemplateContents());
      const outputHTML = template(templateArguments);

      fs.writeFileSync(
        `${this._outputDirectory}/${page.getOutputPath()}`,
        outputHTML
      );
    }
  }

  /**
   * Creates the Object that will be passed in as arguments to the templates
   * note: verticalConfigs is deprecated and will be removed in the next
   * major jambo version.
   *
   * @param {string} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {Object} currentLocaleConfig the chunk of localeConfig for the current locale
   * @param {Object} globalConfig
   * @param {Object<string, Object>} pageNameToConfig
   * @param {string} locale the locale for the page being built
   * @param {string} pageName the name of the current page,
   *                          e.g. index for index.html or index.fr.html
   * @returns {Object}
   */
  _buildArgsForTemplate({
    relativePath,
    currentLocaleConfig,
    globalConfig,
    pageNameToConfig,
    locale,
    pageName
  }) {
    if (fs.existsSync(this._templateDataFormatter)) {
      return this._getTemplateDataFromFormatter({
        relativePath,
        currentLocaleConfig,
        globalConfig,
        pageNameToConfig,
        locale,
        pageName
      });
    }
    const localizedGlobalConfig =
      this._getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale);
    return Object.assign(
      {},
      pageNameToConfig[pageName],
      {
        verticalConfigs: pageNameToConfig,
        global_config: localizedGlobalConfig,
        relativePath: relativePath,
        params: currentLocaleConfig.params || {},
        env: this._env
      }
    );
  }

  /**
   * Gets the global config, with experienceKey and locale added
   * to it from the currentLocaleConfig.
   * 
   * @param {Object} globalConfig 
   * @param {string} currentLocaleConfig chunk of locale config for the current locale
   */
  _getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale) {
    const localizedGlobalConfig = {
      ...globalConfig
    };
    const { experienceKey } = currentLocaleConfig;
    if (experienceKey) {
      localizedGlobalConfig.experienceKey = experienceKey;
    }
    if (locale) {
      localizedGlobalConfig.locale = locale;
    }
    return localizedGlobalConfig;
  }

  /**
   * Returns the data after performing the given template data hook 
   * transformation on it.
   *
   * @param {string} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {string} locale the locale for the page being built
   * @param {string} pageName the name of the current page,
   *                          e.g. index for index.html or index.fr.html
   * @param {Object} globalConfig
   * @param {Object} currentLocaleConfig the chunk of locale config for the current locale
   * @param {Object<string, Object>} pageNameToConfig
   */
  _getTemplateDataFromFormatter({
    relativePath,
    locale,
    pageName,
    globalConfig,
    currentLocaleConfig,
    pageNameToConfig
  }) {
    try {
      const formatterFunction = require(this._templateDataFormatter);
      const pageMetadata = {
        relativePath,
        pageName
      };
      const siteLevelAttributes = {
        globalConfig,
        currentLocaleConfig,
        locale,
        env: this._env
      };
      return formatterFunction(pageMetadata, siteLevelAttributes, pageNameToConfig);
    } catch (err) {
      const msg =
        `Could not load template data hook from ${this._templateDataFormatter}: `;
      throw new UserError(msg, err.stack);
    }
  }

  /**
   * Calculates the path from the page output file to the root output directory.
   *
   * @param {String} filePath the path to the page output file
   * @returns {String}
   */
  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), '') || '.';
  }
}
