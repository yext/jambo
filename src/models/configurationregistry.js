const { getPageName } = require('../utils/fileutils');
const GlobalConfig = require('./globalconfig');
const LocalizationConfig = require('./localizationconfig');
const PageConfig = require('./pageconfig');
const UserError = require('../errors/usererror');

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
   */
  constructor({ globalConfig, localizationConfig, pageConfigs }) {
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
  }

  /**
   * Returns the global config
   *
   * @returns {GlobalConfig} global config
   */
  getGlobalConfig () {
    return this._globalConfig;
  }

  /**
   * Returns the localization config
   *
   * @returns {LocalizationConfig} localization config
   */
  getLocalizationConfig () {
    return this._localizationConfig;
  }

  /**
   * Returns the page configs
   *
   * @returns {Array<PageConfig>} page configs
   */
  getPageConfigs () {
    return this._pageConfigs;
  }

  /**
   * Creates @type {ConfigurationRegistry} from the raw configuration objects.
   * This method converts the raw configuration objects into domain models that the
   * ConfigurationRegistry understands, but it does not mutate or localize the
   * configuration in any way.
   *
   * @param {Object<String, Object>} configNameToRawConfig
   * @returns {ConfigurationRegistry}
   */
  static from(configNameToRawConfig) {
    const globalConfigName = 'global_config';
    const localizationConfigName = 'locale_config';

    const rawGlobalConfig = configNameToRawConfig[globalConfigName];
    if (!rawGlobalConfig) {
      throw new UserError(`Error: Cannot find '${globalConfigName}', exiting.`);
    }

    const rawLocaleConfig = configNameToRawConfig[localizationConfigName];
    if (!rawLocaleConfig) {
      console.log(`Cannot find '${localizationConfigName}', using locale information from ${globalConfigName}.`);
    }
    const localizationConfig = new LocalizationConfig(rawLocaleConfig);

    const pageConfigs = Object.keys(configNameToRawConfig)
      .map((configName) => {
        if (configName !== globalConfigName && configName !== localizationConfigName) {
          const pageName = localizationConfig.hasConfig()
            ? getPageName(configName)
            : configName;
          const locale = localizationConfig.hasConfig() && ConfigurationRegistry._parseLocale(configName);
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
    });
  }

  /**
   * Parses the locale from a given configName
   *
   * @param {String} configName the file name of the config, without the extension
   * @returns {String}
   */
  static _parseLocale (configName) {
    const configNameParts = configName.split('.');
    return configNameParts.length > 1 && configNameParts[1];
  }
}