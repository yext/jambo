const LocaleConfigValidator = require('../../src/validation/localeconfigvalidator');
const UserError = require('../../src/errors/usererror');

describe('LocaleConfigValidator works properly', () => {
  it('does not throw an error with a correct config', () => {
    const config = {
      default: 'en',
      localeConfig: {}
    };
    expect(() => new LocaleConfigValidator(config).validate()).not.toThrow();
  });

  it('throws error when key "default" is missing or misspelled', () => {
    const defaultMispelledConfig = {
      defautl: 'en',
      localeConfig: {}
    }
    expect(() => new LocaleConfigValidator(defaultMispelledConfig).validate())
      .toThrow(UserError);
  });

  it('throws error when key "localeConfig" is missing or misspelled', () => {
    const localeConfigMispelledConfig = {
      default: 'en',
      localeConfiggg: {}
    }
    expect(() => new LocaleConfigValidator(localeConfigMispelledConfig).validate())
      .toThrow(UserError);
  });
});