const GlobalConfig = require('../../models/globalconfig');

/**
 * GlobalConfigLocalizer is responsible for generating a localized {@link GlobalConfig}.
 */
module.exports = class GlobalConfigLocalizer {
  constructor(localizationConfig) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Generates a localized {@link GlobalConfig}
   *
   * @param {GlobalConfig} globalConfig
   * @returns {GlobalConfig}
   */
  localize(globalConfig, locale) {
    const experienceKey = this._localizationConfig.getExperienceKey(locale)
      || globalConfig.getExperienceKey();

    return new GlobalConfig({
      ...globalConfig.getConfig(),
      experienceKey: experienceKey,
      ...locale && { locale: locale }
    });
  }
}