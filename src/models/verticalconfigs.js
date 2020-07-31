const { LocaleConfig } = require('./localeconfig');
const { ConfigLocalizer } = require('../commands/build/configlocalizer');
const { getPageId } = require('../utils/fileutils');

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

    this._localesWithLocalizedConfig = this._getPageIdsForLocalizedConfigs(configIdToConfig);
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
   * Gets the pageIds that correspond to the configs with a locale-specific config.
   *
   * @param {string} locale
   * @returns {Array<string>} pageIds
   */
  getPageIdsWithLocalizedConfig(locale = this._defaultLocale) {
    return this._localesWithLocalizedConfig[locale];
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

    for (const locale of locales) {
      const localeFallbacks = localeConfig.getFallbacks(locale);
      localeToPageIdToConfig[locale] = new ConfigLocalizer()
        .generateLocalizedPageConfigs(configIdToConfig, locale, localeFallbacks);
    }
    return localeToPageIdToConfig;
  }

  /**
   * Gets an object mapping locale to a collection of pageIds for that have localized
   * configs.
   *
   * @param {Object} configIdToConfig
   * @returns {Object}
   */
  _getPageIdsForLocalizedConfigs (configIdToConfig) {
    let localeToPageIds = {};
    for (const configId of Object.keys(configIdToConfig)) {
      const locale = this._getLocale(configId) || this._defaultLocale;
      const pageId = getPageId(configId);

      localeToPageIds[locale] = localeToPageIds[locale]
        ? localeToPageIds[locale].push(pageId)
        : [ pageId ];
    }

    return localeToPageIds;
  }

  /**
   * Extracts the locale from a given configId
   *
   * @param {string} filename the file name of the page handlebars template
   * @returns {string}
   */
  _getLocale (configId) {
    const configIdParts = configId.split('.');
    return configIdParts.length > 1 && configIdParts[1];
  }
}
