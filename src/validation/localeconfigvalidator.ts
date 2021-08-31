import UserError from '../errors/usererror';
import { FileNames } from '../constants';
import LocalizationConfig from '../models/localizationconfig';

/**
 * Performs validation on locale_config.json
 */
export default class LocaleConfigValidator {
  private _localizationConfig: LocalizationConfig

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
  _validateConfigHasKey(key: string) {
    if (!(key in this._localizationConfig)) {
      throw new UserError(`Key '${key}' not found in ${FileNames.LOCALE_CONFIG}`);
    }
  }
}