const GlobalConfig = require('./globalconfig');
const GlobalConfigLocalizer = require('../commands/build/globalconfiglocalizer');
const LocalizationConfig = require('./localizationconfig');
const PageConfig = require('./pageconfig');
const PageSetBuilder = require('../commands/build/pagesetbuilder');
const PageSet = require('./pageset');
const PageTemplate = require('./pagetemplate');

/**
 * GeneratedData is a representation of the data generated by Jambo. It understands
 * the @type {GlobalConfig}, @type {LocalizationConfig}, a group of @type {Page}s.
 */
module.exports = class GeneratedData {
  /**
   * @param {LocalizationConfig} localizationConfig
   * @param {String} defaultLocale
   * @param {Object<String, PageSet>} localeToPageSet
   */
  constructor({ localizationConfig, defaultLocale, localeToPageSet }) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;

    /**
     * @type {Array<Page>}
     */
    this._localeToPageSet = localeToPageSet;
  }

  /**
   * Gets the locales configured through Jambo
   *
   * @param {String} locale
   * @returns {Array<String>}
   */
  getLocales () {
    const locales = this._localizationConfig.getLocales();
    return locales.length ? locales : [ this._defaultLocale ];
  }

  /**
   * Gets the locale fallbacks
   *
   * @param {String} locale
   * @returns {Array<String>}
   */
  getLocaleFallbacks (locale) {
    return this._localizationConfig.getFallbacks(locale);
  }

  /**
   * Gets pages for locale
   *
   * @param {String} locale
   * @returns {PageSet}
   */
  getPageSet (locale) {
    return this._localeToPageSet[locale];
  }

  /**
   * @param {GlobalConfig} globalConfig
   * @param {LocalizationConfig} localizationConfig
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   */
  static from({ globalConfig, localizationConfig, pageConfigs, pageTemplates }) {
    const defaultLocale = localizationConfig.getDefaultLocale() || globalConfig.getLocale() || '';

    const localeToGlobalConfig = new GlobalConfigLocalizer(localizationConfig)
      .generateLocaleToGlobalConfig(globalConfig);

    const localeToPageSet = new PageSetBuilder({
      localizationConfig: localizationConfig,
      localeToGlobalConfig: localeToGlobalConfig,
      defaultLocale: defaultLocale,
    }).build(pageConfigs, pageTemplates);

    return new GeneratedData({
      localeToPageSet: localeToPageSet,
      localizationConfig: localizationConfig,
      defaultLocale: defaultLocale
    })
  }
}
