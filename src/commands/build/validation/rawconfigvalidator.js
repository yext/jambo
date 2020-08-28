const GlobalConfigValidator = require('./globalconfigvalidator');
const LocaleConfigValidator = require('./localeconfigvalidator');
const PageConfigsValidator = require('./pageconfigsvalidator');
const { configKeys } = require('../../../constants');

/**
 * Performs validation on the raw configuration files
 * including global_config.json, locale_config.json, and 
 * the various page configurations
 */
module.exports = class RawConfigValidator {
  constructor (configNameToRawConfig) {
    /**
     * @type {Object<string, Object>}
     */
    this._configNameToRawConfig = configNameToRawConfig;
  }

  validate () {
    new GlobalConfigValidator(this._getGlobalConfig()).validate();
    if (!this._isMissingLocaleConfig()){
      new LocaleConfigValidator(this._getLocaleConfig()).validate();
      new PageConfigsValidator(this._configNameToRawConfig).validate();
    }
  }

  /**
   * @returns {boolean}
   */
  _isMissingLocaleConfig () {
    return !this._configNameToRawConfig[configKeys.LOCALE_CONFIG];
  }

  /**
   * @returns {Object<string, string>}
   */
  _getGlobalConfig () {
    return this._configNameToRawConfig[configKeys.GLOBAL_CONFIG];
  }

  /**
   * @returns {Object<string, string|Object>}
   */
  _getLocaleConfig () {
    return this._configNameToRawConfig[configKeys.LOCALE_CONFIG];
  }
}