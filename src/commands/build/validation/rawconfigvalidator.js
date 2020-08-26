const GlobalConfigValidator = require('./globalconfigvalidator');
const LocaleConfigValidator = require('./localeconfigvalidator');
const PageConfigsValidator = require('./pageconfigsvalidator');
const { configKeys } = require('../../../constants');

module.exports = class RawConfigValidator {
  constructor (configNameToRawConfig) {
    this._configNameToRawConfig = configNameToRawConfig;
  }

  validate () {
    new GlobalConfigValidator(this._getGlobalConfig()).validate();
    if (!this._isMissingLocaleConfig()){
      new LocaleConfigValidator(this._getLocaleConfig()).validate();
      new PageConfigsValidator(this._configNameToRawConfig).validate();
    }
  }

  _isMissingLocaleConfig () {
    return !this._configNameToRawConfig[configKeys.LOCALE_CONFIG];
  }

  _getGlobalConfig () {
    return this._configNameToRawConfig[configKeys.GLOBAL_CONFIG];
  }

  _getLocaleConfig () {
    return this._configNameToRawConfig[configKeys.LOCALE_CONFIG];
  }
}