const { LocaleConfig } = require('./localeconfig');
const { VerticalConfigs } = require('./verticalconfigs');

/**
 * Data model for the data generated by Jambo, aggregated from config files and page files.
 */
exports.GeneratedData = class {
  constructor(pagesConfig, pageTemplateInfo, configDir) {
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

    let verticalConfigObjects = Object.keys(pagesConfig).reduce((object, key) => {
      if (key !== globalConfigName && key !== localeConfigName) {
        object[key] = pagesConfig[key];
      }
      return object;
    }, {});
    this.verticalConfigs = new VerticalConfigs({
      verticalConfigs: verticalConfigObjects,
      pageTemplateInfo: pageTemplateInfo,
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
  getGlobalConfig(locale) {
    let test = Object.assign({},
      this.globalConfig,
      {
        experienceKey: this.localeConfig.getExperienceKey(locale) || this.globalConfig.experienceKey,
        apiKey: this.localeConfig.getApiKey(locale) || this.globalConfig.apiKey,
        locale: locale || this.globalConfig.locale
      }
    );
    return test;
  }

  /**
   * Gets the params for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getParams(locale) {
    return this.localeConfig.getParams(locale);
  }

  /**
   * Gets the locales configured through Jambo
   *
   * @param {string} locale
   * @returns {Array}
   */
  getLocales() {
    const locales = this.localeConfig.getLocales();
    return locales.length ? locales : [ this.defaultLocale ];
  }

  /**
   * Gets the vertical config set for a given locale
   *
   * @param {string} locale
   * @returns {Object}
   */
  getVerticalConfigs(locale) {
    return this.verticalConfigs.getConfigsForLocale(locale)
  }
}
