const UserError = require('../../../errors/usererror');
const { fileNames } = require('../../../constants');

module.exports = class GlobalConfigValidator {
  constructor (globalConfig) {
    this._globalConfig = globalConfig;
  }

  validate () {
    this._validateExists();
  }

  _validateExists () {
    if (!this._globalConfig) {
      throw new UserError(`Error: Cannot find ${fileNames.GLOBAL_CONFIG}, exiting.`);
    }
  }
}