const LocaleConfigValidator = require('../../../../src/commands/build/validation/localeconfigvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('LocaleConfigValidator works properly', () => {
  const correctConfig = {
    default: 'en',
    localeConfig: {
      en: {
        experienceKey: 'key',
        apiKey: 'apikey'
      },
      fr: {
        experienceKey: 'fr_key',
        apiKey: 'fr_apikey'
      }
    },
    urlFormat: {
      baseLocale: '{locale}/{pageName}.{pageExt}',
      default: '{pageName}.{pageExt}'
    }
  }

  const defaultMispelledConfig = {
    defautl: 'en',
    localeConfig: {}
  }

  const LocaleConfigMispelledConfig = {
    defautl: 'en',
    localeConfig: {}
  }

  it('does not throw an error with a correct config', () => {
      expect(() => new LocaleConfigValidator(correctconfig).validate()).not.toThrow(UserError);
  });

  it('throws error when key "default" is missing or misspelled', () => {
      expect(() => new LocaleConfigValidator(defaultMispelledConfig).validate()).toThrow(UserError);
  });

  it('throws error when key "localeConfig" is missing or misspelled', () => {
    expect(() => new LocaleConfigValidator(LocaleConfigMispelledConfig).validate()).toThrow(UserError);
  });
});