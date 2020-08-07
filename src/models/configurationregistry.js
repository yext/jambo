const { getPageName } = require('../utils/fileutils');
const GlobalConfig = require('./globalconfig');
const LocalizationConfig = require('./localizationconfig');
const PageConfig = require('./pageconfig');

/**
 * ConfigurationRegistry is a registry of the configuration files provided to Jambo.
 *
 * This class creates @type {LocalizationConfig} and @type {PageConfig} objects but does
 * not mutate or localize the configuration in any way.
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
   * @param {Object} configNameToRawConfig
   */
  static from(configNameToRawConfig) {
    const globalConfigName = 'global_config';
    const localizationConfigName = 'locale_config';

    const rawGlobalConfig = configNameToRawConfig[globalConfigName];
    if (!rawGlobalConfig) {
      throw new Error(`Error: Cannot find '${globalConfigName}', exiting.`);
    }

    const rawLocaleConfig = configNameToRawConfig[localizationConfigName];
    if (!rawLocaleConfig) {
      console.log(`Cannot find '${localizationConfigName}', writing pages without locale information.`);
    }

    const pageConfigs = Object.keys(configNameToRawConfig)
      .map((configName) => {
        if (configName !== globalConfigName && configName !== localizationConfigName) {
          return new PageConfig({
            pageName: getPageName(configName),
            locale: ConfigurationRegistry._parseLocale(configName),
            rawConfig: configNameToRawConfig[configName]
          });
        }
      })
      .filter(value => value);

    return new ConfigurationRegistry({
      globalConfig: new GlobalConfig(rawGlobalConfig),
      localizationConfig: new LocalizationConfig(rawLocaleConfig),
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