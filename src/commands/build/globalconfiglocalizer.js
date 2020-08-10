const GlobalConfig = require('../../models/globalconfig');

/**
 * GlobalConfigLocalizer is responsible for generating a set of localized
 * {@link GlobalConfig}s.
 */
module.exports = class GlobalConfigLocalizer {
  constructor(localizationConfig) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Generates a collection of localized {@link GlobalConfig}s
   *
   * @param {GlobalConfig} globalConfig
   * @returns {Array<GlobalConfig>}
   */
  generateLocaleToGlobalConfig(globalConfig) {
    let localizedGlobalConfigs = {};

    // For cases where there is no configuration specified in this._localizationConfig
    localizedGlobalConfigs[globalConfig.getLocale()] = globalConfig;

    for (const locale of this._localizationConfig.getLocales()) {
      const experienceKey = this._localizationConfig.getExperienceKey(locale)
        || globalConfig.getExperienceKey();
      const apiKey = this._localizationConfig.getApiKey(locale)
        || globalConfig.getApiKey();

      localizedGlobalConfigs[locale] = new GlobalConfig({
        ...globalConfig.getConfig(),
        experienceKey: experienceKey,
        apiKey: apiKey,
        locale: locale
      });
    }

    return localizedGlobalConfigs;
  }
}