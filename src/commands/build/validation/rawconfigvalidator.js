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

  /**
   * Performs a series of validation steps
   * 
   * @throws {UserError} Thrown if validation fails
   */
  validate () {
    new GlobalConfigValidator(this._getGlobalConfig()).validate();

    if (this._isMultiLanguageSite()){
      new LocaleConfigValidator(this._getLocaleConfig()).validate();
      new PageConfigsValidator(this._configNameToRawConfig).validate();
    }
  }

  /**
   * @returns {boolean} True if the site is configured for multiple languages
   */
  _isMultiLanguageSite () {
    return Boolean(this._getLocaleConfig());
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