const GlobalConfig = require("../../models/globalconfig");

/**
 * GlobalConfigLocalizer is responsible for generating a set of localized
 * @type {GlobalConfig}s for the localized specified.
 */
module.exports = class GlobalConfigLocalizer {
  constructor(localizationConfig) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Generates a collection of localized @type {GlobalConfig}s
   *
   * @param {GlobalConfig} locale
   * @param {String} locale
   * @returns {Array<GlobalConfig>}
   */
  generateLocaleToGlobalConfig(globalConfig) {
    const additionalLocales = this._localizationConfig.getLocales();
    if (!additionalLocales || additionalLocales.length < 1) {
      return [ GlobalConfig.from(globalConfig.getConfig()) ];
    }

    let localizedGlobalConfigs = {};
    for (const locale of additionalLocales) {
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