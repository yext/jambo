const GlobalConfigValidator = require('../../../../src/commands/build/validation/globalconfigvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('GlobalConfigValidator works properly', () => {
  const config = {};

  it('does not throw an error with a correct config', () => {
      expect(() => new GlobalConfigValidator(config).validate()).not.toThrow(UserError);
  });

  it('throws an error when the config is missing', () => {
    expect(() => new GlobalConfigValidator().validate()).toThrow(UserError);
  });
});