const PageConfig = require('../../models/pageconfig');
const LocalizationConfig = require('../../models/localizationconfig');

/**
 * PageConfigDecorator decorates {@link PageConfig}s, adding additional
 * localized config information to the given page configs based on the
 * information provided.
 */
module.exports = class PageConfigDecorator {
  constructor(localizationConfig) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Creates an object mapping locale to a collection of decorated PageConfigs
   * ({@link PageConfig}). These decorated PageConfigs each have all of the
   * configuration for a given (page, locale) combination, including config
   * based on the locale fallbacks.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @returns {Object<String, Array<PageConfig>>}
   */
  decorate(pageConfigs) {
    const pageNameToPageConfigs = this._getPageNameToConfigs(pageConfigs);
    const decoratedPageConfigs = {};

    for (const configsForPage of Object.values(pageNameToPageConfigs)) {
      for (const config of configsForPage) {
        const decoratedPageConfig = this._decoratePageConfig(config, configsForPage);
        const locale = decoratedPageConfig.getLocale();

        if (!decoratedPageConfigs[locale]) {
          decoratedPageConfigs[locale] = [];
        }
        decoratedPageConfigs[locale].push(decoratedPageConfig);
      }
    }
    return decoratedPageConfigs;
  }

  /**
   * Creates a new PageConfig decorated with all of the configuration for a given
   * locale, merging the internal configuration data based on the fallbacks and locale
   * configuration provided.
   *
   * @param {PageConfig} localeSpecificConfig
   * @param {Array<PageConfig>} configsForPage
   * @returns {PageConfig}
   */
  _decoratePageConfig(localeSpecificConfig, configsForPage) {
    const currentLocale = localeSpecificConfig.getLocale()
      || this._localizationConfig.getDefaultLocale();
    const localeFallbacks = this._localizationConfig.getFallbacks(currentLocale);
    const fallbackConfigs = [];
    for (let i = localeFallbacks.length - 1; i >= 0 ; i--) {
      const fallbackConfig = configsForPage
        .find(config => this._isLocaleMatch(config.getLocale(), localeFallbacks[i]));

      if (fallbackConfig) {
        fallbackConfigs.push(fallbackConfig);
      }
    }
    const defaultConfig = configsForPage
      .find(config => this._isDefaultLocale(config.getLocale()));

    const mergedConfig = this._merge([
      defaultConfig && defaultConfig.getConfig(),
      ...fallbackConfigs.map(config => config && config.getConfig()),
      localeSpecificConfig.getConfig()
    ]);

    return new PageConfig({
      pageName: localeSpecificConfig.getPageName(),
      locale: currentLocale,
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
    return locale === this._localizationConfig.getDefaultLocale() || !locale;
  }
}