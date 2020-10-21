const UserError = require('../errors/usererror');
const { FileNames } = require('../constants');

/**
 * Performs validation on global_config.json
 */
module.exports = class GlobalConfigValidator {
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