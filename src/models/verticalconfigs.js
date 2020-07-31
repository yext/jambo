const { LocaleConfig } = require('./localeconfig');
const { ConfigLocalizer } = require('../commands/build/configlocalizer');

/**
 * Data model for the vertical config files.
 */
exports.VerticalConfigs = class {
  /**
   * @param {Object} configIdToConfig
   * @param {LocaleConfig} localeConfig
   * @param {string} defaultLocale
   */
  constructor({ configIdToConfig, localeConfig, defaultLocale }) {
    this._configIdToConfig = configIdToConfig;
    this._defaultLocale = defaultLocale;

    let locales = localeConfig.getLocales();
    if (!locales.length) {
      locales = [ defaultLocale ];
    }

    this._localeToConfigs = this._sortConfigsByLocale(configIdToConfig, locales, localeConfig);
  }

  /**
   * Gets the vertical configs object for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getPageIdToConfig(locale = this._defaultLocale) {
    return this._localeToConfigs[locale];
  }

  /**
   * Uses config and locales to build an object of the following format:
   * {
   *   [locale] : {
   *     [pageId] : { config },
   *     [pageId] : { config },
   *     [pageId] : { config },
   *   },
   *   [locale2] : { ... },
   *   ...
   * }
   *
   * @param {Object} configIdToConfig
   * @param {Array<string>} locales
   * @param {LocaleConfig} localeConfig
   */
  _sortConfigsByLocale(configIdToConfig, locales, localeConfig) {
    let localeToPageIdToConfig = {};

    for (let locale of locales) {
      let localeFallbacks = localeConfig.getFallbacks(locale);
      localeToPageIdToConfig[locale] = new ConfigLocalizer()
        .generateLocalizedPageConfigs(configIdToConfig, locale, localeFallbacks);
    }
    return localeToPageIdToConfig;
  }
}
