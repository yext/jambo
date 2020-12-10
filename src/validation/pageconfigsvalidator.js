const UserError = require('../errors/usererror');
const { parseLocale, containsLocale } = require('../utils/configutils');
const { FileNames } = require('../constants');

/**
 * Performs validation on page config files
 */
module.exports = class PageConfigsValidator {
  constructor(pageConfigs, configuredLocales) {
    /**
     * A mapping of pages to their configurations. Keys are the config
     * file name, and the values are the config
     *
     * @type {Object<string, Object>}
     */
    this._pageConfigs = pageConfigs;

    /**
     * A list of the locales configured in locale_config.json
     *
     * @type {string[]}
     */
    this._configuredLocales = configuredLocales;
  }

  /**
   * Performs a series of validation steps
   *
   * @throws {UserError} Thrown if validation fails
   */
  validate() {
    this._validatePageLocalesHaveConfigs();
  }

  /**
   * Get the locales associated with the page config files
   *
   * @returns {string[]}
   */
  _getPageLocales() {
    const locales = Object.keys(this._pageConfigs)
      .filter(configName => containsLocale(configName))
      .map(configName => parseLocale(configName));

    return this._removeDuplicates(locales);
  }

  /**
   * @param {string[]} list
   * @returns {string[]}
   */
  _removeDuplicates(list) {
    return [...new Set(list)];
  }

  _validatePageLocalesHaveConfigs() {
    const pageLocales = this._getPageLocales();
    const localesMissingConfigs = this._getLocalesMissingConfigs(pageLocales);
    this._throwErrorForLocalesMissingConfigs(localesMissingConfigs);
  }

  /**
   * Gets locales defined by page configs which do not
   * have a localeConfig in locale_config.json
   *
   * @param {string[]} pageLocales A list of locales defined by page config files
   * @returns {string[]}
   */
  _getLocalesMissingConfigs(pageLocales) {
    const locales = pageLocales.filter(locale => {
      return !this._configuredLocales.includes(locale)
    });
    return locales;
  }

  /**
   * @param {string[]} locales A list of locales which are missing configuration
   */
  _throwErrorForLocalesMissingConfigs(locales) {
    if (locales.length == 1) {
      throw new UserError(
        `The locale '${locales}' is referenced but is not configured ` +
        `inside ${FileNames.LOCALE_CONFIG}`);
    } else if (locales.length > 1) {
      throw new UserError(
        `The locales '${locales}' are referenced but are not defined ` +
        `inside ${FileNames.LOCALE_CONFIG}`);
    }
  }
}