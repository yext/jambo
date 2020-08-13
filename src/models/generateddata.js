const GlobalConfig = require('./globalconfig');
const LocalizationConfig = require('./localizationconfig');
const PageConfig = require('./pageconfig');
const PageSet = require('./pageset');
const PageSetsBuilder = require('../commands/build/pagesetsbuilder');
const PageTemplate = require('./pagetemplate');

/**
 * GeneratedData is a representation of the data generated by Jambo. It deals with
 * the {@link LocalizationConfig}, a group of {@link PageSet}s.
 */
module.exports = class GeneratedData {
  /**
   * @param {LocalizationConfig} localizationConfig
   * @param {String} defaultLocale
   * @param {Array<PageSet>} pageSets
   */
  constructor({ localizationConfig, defaultLocale, pageSets }) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;

    /**
     * @type {Array<PageSet>}
     */
    this._pageSets = pageSets;
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
   * Returns the generated pageSets
   *
   * @returns {Array<PageSet>}
   */
  getPageSets () {
    return this._pageSets;
  }

  /**
   * Builds a {@link GeneratedData} from the given configurations and {@link PageTemplates}.
   *
   * @param {GlobalConfig} globalConfig
   * @param {LocalizationConfig} localizationConfig
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   * @returns {GeneratedData}
   */
  static from({ globalConfig, localizationConfig, pageConfigs, pageTemplates }) {
    const defaultLocale = localizationConfig.getDefaultLocale() || globalConfig.getLocale() || '';

    const pageSets = new PageSetsBuilder({
      localizationConfig: localizationConfig,
      globalConfig: globalConfig,
      defaultLocale: defaultLocale,
    }).build(pageConfigs, pageTemplates);

    return new GeneratedData({
      pageSets: pageSets,
      localizationConfig: localizationConfig,
      defaultLocale: defaultLocale
    })
  }
}
