const { getPageName } = require('../utils/fileutils');
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
   * @param {Object} configNameToRawConfig
   */
  constructor(configNameToRawConfig) {
    const globalConfigName = 'global_config';
    const localizationConfigName = 'locale_config';

    /**
     * @type {Object}
     */
    this._globalConfig = configNameToRawConfig[globalConfigName];
    if (!this._globalConfig) {
      throw new Error(`Error: Cannot find '${globalConfigName}', exiting.`);
    }

    const localizationConfig = configNameToRawConfig[localizationConfigName];
    if (!localizationConfig) {
      console.log(`Cannot find '${localizationConfigName}', writing pages without locale information.`);
    }
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = new LocalizationConfig(configNameToRawConfig[localizationConfigName]);

    /**
     * @type {Array<PageConfig>}
     */
    this._pageConfigs = Object.keys(configNameToRawConfig)
      .map((configName) => {
        if (configName !== globalConfigName && configName !== localizationConfigName) {
          return new PageConfig({
            pageName: getPageName(configName),
            locale: this._parseLocale(configName),
            rawConfig: configNameToRawConfig[configName]
          });
        }
      })
      .filter(value => value);
  }

  /**
   * Returns the global config
   *
   * @returns {Object} global config
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
   * Extracts the locale from a given configName
   *
   * @param {String} configName the file name of the config, without the extension
   * @returns {String}
   */
  _parseLocale (configName) {
    const configNameParts = configName.split('.');
    return configNameParts.length > 1 && configNameParts[1];
  }
}