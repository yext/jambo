const GlobalConfigValidator = require('../../src/validation/globalconfigvalidator');
const UserError = require('../../src/errors/usererror');

describe('GlobalConfigValidator works properly', () => {
  it('does not throw an error with a correct config', () => {
    const config = {};
    expect(() => new GlobalConfigValidator(config).validate()).not.toThrow();
  });

  it('throws an error when the config is missing', () => {
    expect(() => new GlobalConfigValidator().validate()).toThrow(UserError);
  });
});