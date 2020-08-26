const UserError = require('../../../errors/usererror');
const { fileNames } = require('../../../constants');

module.exports = class LocaleConfigValidator {
  constructor (localizationConfig) {
    this._localizationConfig = localizationConfig;
  }
  
  validate () {
    this._validateConfigHasKey('default');
    this._validateConfigHasKey('localeConfig');
  }

  _validateConfigHasKey (key) {
    if (!(key in this._localizationConfig)) {
      throw new UserError(`Key '${key}' not found in ${fileNames.LOCALE_CONFIG}`);
    }
  }
}