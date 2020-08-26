const UserError = require('../../../errors/usererror');
const { parseLocale, containsLocale } = require('../../../utils/configutils');
const { fileNames, configKeys } = require('../../../constants');

module.exports = class PageConfigsValidator {
  constructor (configNameToRawConfig) {
    this._configNameToRawConfig = configNameToRawConfig;
    this._pageLocales = this._getPageLocales();
    this._configuredLocales = this._getConfiguredLocales();
  }
  
  validate () {
    this._validatePageLocalesHaveConfigs();
  }

  _getPageLocales () {
    let locales = Object.keys(this._configNameToRawConfig)
      .filter(configName => 
        configName !== configKeys.GLOBAL_CONFIG && 
        configName !== configKeys.LOCALE_CONFIG &&
        containsLocale(configName)
      )
      .map(configName => {
        return parseLocale(configName);
      })

    return this._removeDuplicates(locales);
  }

  _removeDuplicates (list) {
    return [...new Set(list)];
  }

  _getConfiguredLocales () {
    return Object.keys(this._configNameToRawConfig[configKeys.LOCALE_CONFIG]['localeConfig'])
  }

  _validatePageLocalesHaveConfigs () {
    const missingLocaleConfigs = this._getMissingLocaleConfigs();
    this._throwErrorForConfigs(missingLocaleConfigs);
  }

  _getMissingLocaleConfigs () {
    let missingLocaleConfigs = [];
    this._pageLocales.forEach(locale => {
      if (!(this._configuredLocales.includes(locale))){
        missingLocaleConfigs.push(locale);
      }
    })
    return missingLocaleConfigs;
  }

  _throwErrorForConfigs (missingLocaleConfigs) {
    if (missingLocaleConfigs.length == 1) {
      throw new UserError(`The locale '${missingLocaleConfigs}' is defined in a page configuration file name but is not defined inside ${fileNames.LOCALE_CONFIG}`);
    } else if (missingLocaleConfigs.length > 1) {
      throw new UserError(`The locales '${missingLocaleConfigs}' are defined in page configuration file names but are not defined inside ${fileNames.LOCALE_CONFIG}`);
    }
  }
}