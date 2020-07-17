const { PageConfig } = require("../../models/pageconfig");
const { LocalizationConfig } = require("../../models/localizationconfig");

/**
 * Merges the relevant page configurations based on locale
 */
exports.ConfigLocalizer = class {
  constructor({ localizationConfig, defaultLocale }) {
    /**
     * @type {LocalizationConfig}
     */
    this.localizationConfig = localizationConfig;

    /**
     * @type {String}
     */
    this.defaultLocale = defaultLocale;
  }

  /**
   * Creates localized PageConfigs
   *
   * @param {Array<PageConfig>} pageConfigs
   * @returns {Array<PageConfig>}
   */
  localize(pageConfigs) {
    if (!pageConfigs || pageConfigs.length < 1) {
      return [];
    }

    let localizedPageConfigs = [];
    for (const locale of this.localizationConfig.getLocales()) {
      const configsForPage = [];

      const localeSpecificConfig = configsForPage.find(config => config.getLocale() === locale);

      const localeFallbacks = this.localizationConfig.getFallbacks(locale);
      const fallbackConfigs = [];
      for (let i = localeFallbacks.length - 1; i >= 0 ; i--) {
        const fallbackConfig = configsForPage.find(config => config.getLocale() === localeFallbacks[i]);
        if (fallbackConfig) {
          fallbackConfigs.push(fallbackConfig);
        }
      }
      const defaultConfig = configsForPage
        .find(config => (config.getLocale() === defaultLocale) || (!config.getLocale()));

      const localizedConfig = this._mergeConfigs(
        defaultConfig,
        ...fallbackConfigs,
        localeSpecificConfig
      );

      localizedPageConfigs.push(localizedConfig);
    }
    return localizedPageConfigs;
  }

  /**
   * Merges config objects. This is a shallow merge, the later arguments take precedent.
   *
   * @param {Array<PageConfig>} configs
   * @returns {PageConfig}
   */
  _mergeConfigs(...configs) {
    if (!configs) {
      return {};
    }

    const locale = configs[0].getLocale() || '';
    const pageName = configs[0].getPageName();

    let rawConfig = {};
    for (const config of configs) {
      if (!config) {
        continue;
      }

      rawConfig = Object.assign(rawConfig, config.getConfig());
    }

    return new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: rawConfig
    })
  }
}