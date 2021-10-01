import UserError from '../errors/usererror';
import { FileNames } from '../constants';

/**
 * Performs validation on global_config.json
 */
export default class GlobalConfigValidator {
  private _globalConfig: any;

  constructor(globalConfig) {
    /**
     * @type {Object<string, string>}
     */
    this._globalConfig = globalConfig;
  }

  /**
   * Performs a series of validation steps
   *
   * @throws {UserError} Thrown if validation fails
   */
  validate() {
    this._validateConfigExists();
  }

  _validateConfigExists() {
    if (!this._globalConfig) {
      throw new UserError(
        `Cannot find config ${FileNames.GLOBAL_CONFIG}, exiting.`);
    }
  }
}