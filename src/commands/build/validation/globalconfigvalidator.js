const UserError = require('../../../errors/usererror');
const { fileNames } = require('../../../constants');
const fs = require('fs');

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
    const pathToConfig = `config/${fileNames.GLOBAL_CONFIG}`;
    if (!fs.existsSync(pathToConfig)) {
      throw new UserError(`Error: Cannot find ${pathToConfig}, exiting.`);
    }
  }
}