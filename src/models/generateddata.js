const { LocaleConfig } = require('./localeconfig');
const { VerticalConfigs } = require('./verticalconfigs');

/**
 * Data model for the data generated by Jambo, aggregated from config files and page files.
 */
exports.GeneratedData = class {
  constructor(pagesConfig, configDir) {
    const globalConfigName = 'global_config';
    const localeConfigName = 'locale_config';

    this.globalConfig = pagesConfig[globalConfigName];
    if (!this.globalConfig) {
      throw new Error(`Error: Cannot find ${globalConfigName} file in '${configDir}' directory, exiting.`);
    }

    this.localeConfig = new LocaleConfig({
      localeConfig: pagesConfig[localeConfigName],
      localeConfigName: localeConfigName,
      directoryConfigName: configDir
    });

    this.defaultLocale = this.localeConfig.getDefaultLocale() || this.globalConfig.locale || '';

    const verticalConfigIdToConfig = Object.keys(pagesConfig).reduce((object, key) => {
      if (key !== globalConfigName && key !== localeConfigName) {
        object[key] = pagesConfig[key];
      }
      return object;
    }, {});
    this.verticalConfigs = new VerticalConfigs({
      configIdToConfig: verticalConfigIdToConfig,
      localeConfig: this.localeConfig,
      defaultLocale: this.defaultLocale
    });
  }

  /**
   * Merges the global_config and locale_config objects, along with the given locales
   *
   * @param {string} locale
   * @returns {Object}
   */
  getGlobalConfig (locale) {
    return Object.assign({},
      this.globalConfig,
      {
        experienceKey: this.localeConfig.getExperienceKey(locale) || this.globalConfig.experienceKey,
        apiKey: this.localeConfig.getApiKey(locale) || this.globalConfig.apiKey,
        locale: locale || this.globalConfig.locale
      }
    );
  }

  /**
   * Gets the params for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getParams (locale) {
    return this.localeConfig.getParams(locale);
  }

  /**
   * Gets the default locale
   *
   * @returns {string}
   */
  getDefaultLocale () {
    return this.defaultLocale;
  }

  /**
   * Gets the locales configured through Jambo
   *
   * @param {string} locale
   * @returns {Array}
   */
  getLocales () {
    const locales = this.localeConfig.getLocales();
    return locales.length ? locales : [ this.defaultLocale ];
  }

  /**
   * Get the fallbacks for a given locale
   *
   * @param {string} locale
   * @returns {Array}
   */
  getLocaleFallbacks (locale) {
    return this.localeConfig.getFallbacks(locale);
  }

  /**
   * Get the fallbacks for a given locale
   *
   * @param {string} locale
   * @returns {Array}
   */
  getUrlFormatter (locale) {
    return this.localeConfig.getUrlFormatter(locale);
  }

  /**
   * Gets the vertical config set for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getPageIdToConfig (locale) {
    return this.verticalConfigs.getPageIdToConfig(locale)
  }

  /**
   * Gets the pageIds that correspond to the configs with a locale-specific config.
   *
   * @param {string} locale
   * @returns {Object}
   */
  getPageIdsForLocale (locale) {
    let pageIds = this.verticalConfigs.getPageIdsWithLocalizedConfig(locale);

    for (const fallback in this.getLocaleFallbacks(locale)) {
      const fallbackPageIds = this.verticalConfigs.getPageIdsWithLocalizedConfig(fallback) || [];
      pageIds.push(...fallbackPageIds);
    }
    return pageIds;
  }
}
