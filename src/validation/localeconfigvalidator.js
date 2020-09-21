const UserError = require('../errors/usererror');
const { FileNames } = require('../constants');

/**
 * Performs validation on locale_config.json
 */
module.exports = class LocaleConfigValidator {
  constructor(localizationConfig) {
    /**
     * @type {Object<string, string|Object>}
     */
    this._localizationConfig = localizationConfig;
  }
  
  /**
   * Performs a series of validation steps
   * 
   * @throws {UserError} Thrown if validation fails
   */
  validate() {
    this._validateConfigHasKey('default');
    this._validateConfigHasKey('localeConfig');
  }

  /**
   * @param {string} key The key to check
   */
  _validateConfigHasKey(key) {
    if (!(key in this._localizationConfig)) {
      throw new UserError(`Key '${key}' not found in ${FileNames.LOCALE_CONFIG}`);
    }
  }
}