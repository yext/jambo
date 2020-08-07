const LocalizationConfig = require("../../models/localizationconfig");
const PageConfig = require("../../models/pageconfig");

 /**
 * PageConfigDecorator creates a set of localized @type {PageConfig}s.
 *
 * This class localizes @type {PageConfig}s by merging the relevant page
 * configurations based on locale information and creating new, localized
 * @type {PageConfig} objects.
 */
module.exports = class PageConfigDecorator {
  constructor({ localizationConfig, defaultLocale }) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;
  }

  /**
   * Creates a localized PageConfig for every page and locale, merging the rawConfigs
   * based on the fallbacks and locale configuration in this._localizationConfig.
   *
   * This function considers locale fallbacks, so more PageConfig may be returned than were
   * originally provided. It returns one PageConfig per (config, locale) combination.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @returns {Array<PageConfig>}
   */
  decorate(pageConfigs) {
    const pageNameToConfigs = this._getPageNameToConfigs(pageConfigs);

    let localizedPageConfigs = {};
    for (const locale of this._localizationConfig.getLocales()) {
      localizedPageConfigs[locale] = [];

      for (const [pageName, configsForPage] of Object.entries(pageNameToConfigs)) {
        const mergedPageConfigForLocale = this._mergePageConfigs(pageName, locale, configsForPage);

        if (mergedPageConfigForLocale) {
          localizedPageConfigs[locale].push(mergedPageConfigForLocale);
        }
      }
    }
    return localizedPageConfigs;
  }

  /**
   * Creates a new PageConfig for the given pageName and locale with a merged config
   * based on the locale and fallbacks.
   *
   * @param {String} pageName
   * @param {String} locale
   * @param {Array<PageConfig>} configs
   * @returns {PageConfig}
   */
  _mergePageConfigs(pageName, locale, configs) {
    const localeSpecificConfig = configs.find(config => this._isLocaleMatch(config.getLocale(), locale));
    if (!localeSpecificConfig) {
      return;
    }

    const localeFallbacks = this._localizationConfig.getFallbacks(locale);
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
   * Builds an Object mapping page name to PageConfigs with the corresponding page name
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
   * Merges raw configs and returns a new, merged object. This is a shallow merge,
   * the later arguments take precedent. Falsy configs are filtered out.
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
    return locale === this._defaultLocale || !locale;
  }
}