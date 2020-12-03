const { getPageName } = require('../utils/fileutils');
const { parseLocale } = require('../utils/configutils');
const GlobalConfig = require('./globalconfig');
const LocalizationConfig = require('./localizationconfig');
const PageConfig = require('./pageconfig');
const ThemeConfig = require('./themeconfig');
const { FileNames, ConfigKeys } = require('../constants');
const RawConfigValidator = require('../validation/rawconfigvalidator');

/**
 * ConfigurationRegistry is a registry of the configuration files provided to Jambo.
 *
 * This class does not mutate or localize the configuration in any way.
 */
module.exports = class ConfigurationRegistry {
  /**
   * @param {GlobalConfig} globalConfig
   * @param {LocalizationConfig} localizationConfig
   * @param {Array<PageConfig>} pageConfigs
   * @param {ThemeConfig} themeConfig
   */
  constructor({ globalConfig, localizationConfig, pageConfigs, themeConfig }) {
    /**
     * @type {GlobalConfig}
     */
    this._globalConfig = globalConfig;

    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {Array<PageConfig>}
     */
    this._pageConfigs = pageConfigs;

    /**
     * @type {ThemeConfig}
     */
    this._themeConfig = themeConfig;
  }

  /**
   * Returns the global config
   *
   * @returns {GlobalConfig} global config
   */
  getGlobalConfig() {
    return this._globalConfig;
  }

  /**
   * Returns the localization config
   *
   * @returns {LocalizationConfig} localization config
   */
  getLocalizationConfig() {
    return this._localizationConfig;
  }

  /**
   * Returns the theme config
   *
   * @returns {ThemeConfig}
   */
  getThemeConfig() {
    return this._themeConfig;
  }


  /**
   * Returns the page configs
   *
   * @returns {Array<PageConfig>} page configs
   */
  getPageConfigs() {
    return this._pageConfigs;
  }

  /**
   * Performs validation on the raw configuration files
   *
   * @param {Object<String, Object>} configNameToRawConfig
   * @throws {UserError} Thrown if validation fails
   */
  static validate(configNameToRawConfig) {
    new RawConfigValidator(configNameToRawConfig).validate();
  }

  /**
   * Creates @type {ConfigurationRegistry} from the raw configuration objects.
   * This method converts the raw configuration objects into domain models that the
   * ConfigurationRegistry understands, but it does not mutate or localize the
   * configuration in any way.
   *
   * @param {Object<String, Object>} configNameToRawConfig
   * @param {Object} rawThemeConfig
   * @returns {ConfigurationRegistry}
   * @throws {UserError} Thrown if configNameToRawConfig is invalid
   */
  static from(configNameToRawConfig, rawThemeConfig = {}) {
    this.validate(configNameToRawConfig);

    const rawGlobalConfig = configNameToRawConfig[ConfigKeys.GLOBAL_CONFIG];
    const rawLocaleConfig = configNameToRawConfig[ConfigKeys.LOCALE_CONFIG];

    if (!rawLocaleConfig) {
      console.log(
        `Cannot find '${FileNames.LOCALE_CONFIG}', using locale information ` +
        `from ${FileNames.GLOBAL_CONFIG}.`);
    }
    const localizationConfig = new LocalizationConfig(rawLocaleConfig);

    const pageConfigs = Object.keys(configNameToRawConfig)
      .map((configName) => {
        if (configName !== ConfigKeys.GLOBAL_CONFIG
            && configName !== ConfigKeys.LOCALE_CONFIG) {
          const pageName = localizationConfig.hasConfig()
            ? getPageName(configName)
            : configName;
          const locale = localizationConfig.hasConfig() && parseLocale(configName);
          return new PageConfig({
            pageName: pageName,
            locale: locale,
            rawConfig: configNameToRawConfig[configName]
          });
        }
      })
      .filter(value => value);

    return new ConfigurationRegistry({
      globalConfig: new GlobalConfig(rawGlobalConfig),
      localizationConfig: localizationConfig,
      pageConfigs: pageConfigs,
      themeConfig: new ThemeConfig(rawThemeConfig)
    });
  }
}