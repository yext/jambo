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
   * Creates a localized PageConfig for every page and locale, merging the rawConfigs
   * based on the fallbacks and locale configuration in this.localizationConfig.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @returns {Array<PageConfig>}
   */
  createLocalizedPageConfigs(pageConfigs) {
    const pageNameToConfigs = this._getPageNameToConfigs(pageConfigs);

    let localizedPageConfigs = [];
    for (const locale of this.localizationConfig.getLocales()) {
      for (const [pageName, configsForPage] of Object.entries(pageNameToConfigs)) {
        const mergedPageConfigForLocale = this._mergePageConfigs(pageName, locale, configsForPage);

        if (mergedPageConfigForLocale) {
          localizedPageConfigs.push(mergedPageConfigForLocale);
        }
      }
    }
    return localizedPageConfigs;
  }

  /**
   * Builds a new PageConfig for the given pageName and locale with a merged config
   * based on the locale and fallbacks.
   *
   * @param {String} pageName
   * @param {String} locale
   * @param {Array<PageConfig>} configs
   * @returns {PageConfig}
   */
  _mergePageConfigs(pageName, locale, configs) {
    const localeSpecificConfig = configs.find(config => this._isLocaleMatch(config.getLocale(), locale));

    const localeFallbacks = this.localizationConfig.getFallbacks(locale);
    const fallbackConfigs = [];
    for (let i = localeFallbacks.length - 1; i >= 0 ; i--) {
      const fallbackConfig = configs
        .find(config => this._isLocaleMatch(config.getLocale(), localeFallbacks[i]));

      if (fallbackConfig) {
        fallbackConfigs.push(fallbackConfig);
      }
    }
    const defaultConfig = configs
      .find(config => this._isDefaultLocale(config.getLocale()));

    const hasLocalizedConfig = localeSpecificConfig || fallbackConfigs.length > 0;

    if (!hasLocalizedConfig) {
      return;
    }

    const mergedConfig = this._merge([
      defaultConfig && defaultConfig.getConfig(),
      ...fallbackConfigs.map(config => config && config.getConfig()),
      localeSpecificConfig && localeSpecificConfig.getConfig()
    ]);

    return new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: mergedConfig,
    });
  }

  /**
   * Builds an Object mapping page name to PageConfigs with for the corresponding page.
   *
   * @param {Array<PageConfig>} configs
   * @returns {Object}
   */
  _getPageNameToConfigs(pageConfigs) {
    if (!pageConfigs || pageConfigs.length < 1) {
      return {};
    }

    let pageNameToConfigs = {};
    for (const config of pageConfigs) {
      const pageName = config.getPageName();
      if (!pageNameToConfigs[pageName]) {
        pageNameToConfigs[pageName] = [];
      }
      pageNameToConfigs[pageName].push(config);
    }
    return pageNameToConfigs;
  }

  /**
   * Merges raw configs. This is a shallow merge, the later arguments take precedent.
   *
   * @param {Array<Object>} objects
   * @returns {Object}
   */
  _merge(objects) {
    const truthyObjects = objects && objects.filter(config => config);
    if (!truthyObjects || truthyObjects.length < 1) {
      return {};
    }

    return Object.assign({}, ...truthyObjects);
  }

  /**
   * Determines whether the given locales match
   *
   * @param {String} locale
   * @returns {boolean}
   */
  _isLocaleMatch(locale1, locale2) {
    return locale1 === locale2 ||
      (this._isDefaultLocale(locale1) && (this._isDefaultLocale(locale2)));
  }

  /**
   * Determines whether the given locale is the default locale
   *
   * @param {String} locale
   * @returns {boolean}
   */
  _isDefaultLocale(locale) {
    return locale === this.defaultLocale || !locale;
  }
}