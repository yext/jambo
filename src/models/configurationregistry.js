const { getPageName } = require('../utils/fileutils');
const PageConfig = require('./pageconfig');
const LocalizationConfig = require('./localizationconfig');

/**
 * ConfigurationRegistry
 */
module.exports = class ConfigurationRegistry {
  constructor(configs, configDir) {
    const globalConfigName = 'global_config';
    const localizationConfigName = 'locale_config';

    /**
     * @type {Object}
     */
    this.globalConfig = configs[globalConfigName];
    if (!this.globalConfig) {
      throw new Error(`Error: Cannot find '${globalConfigName}' file in '${configDir}' directory, exiting.`);
    }

    const localizationConfig = configs[localizationConfigName];
    if (!localizationConfig) {
      console.log(`Cannot find '${localizationConfigName}' file in ${configDir} directory, writing pages without locale information.`);
    }
    /**
     * @type {LocalizationConfig}
     */
    this.localizationConfig = new LocalizationConfig(configs[localizationConfigName]);

    /**
     * @type {Array<PageConfig>}
     */
    this.pageConfigs = Object.keys(configs)
      .map((configName) => {
        if (configName !== globalConfigName && configName !== localizationConfigName) {
          return new PageConfig({
            pageName: getPageName(configName),
            locale: this._parseLocale(configName),
            rawConfig: configs[configName]
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
    return this.globalConfig;
  }

  /**
   * Returns the localization config
   *
   * @returns {LocalizationConfig} localization config
   */
  getLocalizationConfig () {
    return this.localizationConfig;
  }

  /**
   * Returns the page configs
   *
   * @returns {Array<PageConfig>} page configs
   */
  getPageConfigs () {
    return this.pageConfigs;
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