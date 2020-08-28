const UserError = require('../../../errors/usererror');
const { fileNames } = require('../../../constants');

/**
 * Performs validation on global_config.json
 */
module.exports = class GlobalConfigValidator {
  constructor (globalConfig) {
    /**
    * @type {Object<string, string>}
    */
    this._globalConfig = globalConfig;
  }

  validate () {
    this._validateConfigExists();
  }

  _validateConfigExists () {
    if (!this._globalConfig) {
      throw new UserError(`Error: Cannot find ${fileNames.GLOBAL_CONFIG}, exiting.`);
    }
  }
}