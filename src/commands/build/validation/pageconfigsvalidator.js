const UserError = require('../../../errors/usererror');
const { parseLocale, containsLocale } = require('../../../utils/configutils');
const { fileNames, configKeys } = require('../../../constants');

/**
 * Performs validation on page config files
 */
module.exports = class PageConfigsValidator {
  constructor (configNameToRawConfig) {
    /**
     * @type {Object<string, Object>}
     */
    this._configNameToRawConfig = configNameToRawConfig;

    /**
     * A list of the locales accociated with the page config files
     * 
     * @type {string[]}
     */
    this._pageLocales = this._getPageLocales();

    /**
     * A list of the locales configured in locale_config.json
     * 
     * @type {string[]}
     */
    this._configuredLocales = this._getConfiguredLocales();
  }
  
  validate () {
    this._validatePageLocalesHaveConfigs();
  }

  /**
   * Get the locales associated with the page config files
   * 
   * @returns {string[]}
   */
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

  /**
   * @param {*[]} list 
   * @returns {*[]}
   */
  _removeDuplicates (list) {
    return [...new Set(list)];
  }

  /**
   * @type {string[]}
   */
  _getConfiguredLocales () {
    return Object.keys(this._configNameToRawConfig[configKeys.LOCALE_CONFIG]['localeConfig'])
  }

  _validatePageLocalesHaveConfigs () {
    const locales = this._getLocalesMissingConfigs();
    this._throwErrorForLocalesMissingConfigs(locales);
  }

  /**
   * Gets locales defined by a page configs which do not
   * have a localeConfig in locale_config.json
   * 
   * @returns {string[]}
   */
  _getLocalesMissingConfigs () {
    let locales = [];
    this._pageLocales.forEach(locale => {
      if (!(this._configuredLocales.includes(locale))){
        locales.push(locale);
      }
    })
    return locales;
  }

  /**
   * @param {string[]} locales A list of locales which are missing configuration
   */
  _throwErrorForLocalesMissingConfigs (locales) {
    if (locales.length == 1) {
      throw new UserError(`The locale '${locales}' is defined in a page configuration file name but is not defined inside ${fileNames.LOCALE_CONFIG}`);
    } else if (locales.length > 1) {
      throw new UserError(`The locales '${locales}' are defined in page configuration file names but are not defined inside ${fileNames.LOCALE_CONFIG}`);
    }
  }
}