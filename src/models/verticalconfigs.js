const { LocaleConfig } = require('./localeconfig');
const { ConfigMerger } = require('../commands/build/configmerger');
const { PageResolver } = require('../commands/build/pageresolver');

/**
 * Data model for the vertical config files.
 */
exports.VerticalConfigs = class {
  /**
   * @param {Object} verticalConfigs
   * @param {Array} pageTemplateInfo
   * @param {LocaleConfig} localeConfig
   * @param {string} defaultLocale
   */
  constructor({ verticalConfigs, pageTemplateInfo, localeConfig, defaultLocale }) {
    this._verticalConfigs = verticalConfigs;
    this._defaultLocale = defaultLocale;

    let locales = localeConfig.getLocales();
    if (!locales.length) {
      locales = [ defaultLocale ];
    }

    this._localeToConfigs = {};
    for (let locale of locales) {
      let localeFallbacks = localeConfig.getFallbacks(locale);
      let pageIdToPath = new PageResolver().buildPageIdToPath(
        pageTemplateInfo,
        locale || this.locale,
        localeFallbacks
      );

      this._localeToConfigs[locale] = new ConfigMerger()
        .mergeConfigsForLocale(this._verticalConfigs, localeFallbacks, locale);

      for (let pageId of Object.keys(this._localeToConfigs[locale])) {
        if (!pageIdToPath[pageId]) {
          delete this._localeToConfigs[locale][pageId];
          continue;
        }

        let pageConfig = this._localeToConfigs[locale][pageId];
        const path = pageIdToPath[pageId];
        pageConfig.templatePath = pageIdToPath[pageId];
        pageConfig.url = localeConfig.getUrl(pageId, path, locale);
      }
    }
  }

  /**
   * Gets the vertical configs object for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getConfigsForLocale(locale = this._defaultLocale) {
    return this._localeToConfigs[locale];
  }
}
