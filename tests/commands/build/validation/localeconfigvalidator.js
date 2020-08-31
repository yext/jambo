const LocaleConfigValidator = require('../../../../src/commands/build/validation/localeconfigvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('LocaleConfigValidator works properly', () => {
  it('does not throw an error with a correct config', () => {
    const config = {
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
    };
    expect(() => new LocaleConfigValidator(config).validate()).not.toThrow(UserError);
  });

  it('throws error when key "default" is missing or misspelled', () => {
    const defaultMispelledConfig = {
      defautl: 'en',
      localeConfig: {}
    }
    expect(() => new LocaleConfigValidator(defaultMispelledConfig).validate()).toThrow(UserError);
  });

  it('throws error when key "localeConfig" is missing or misspelled', () => {
    const localeConfigMispelledConfig = {
      default: 'en',
      localeConfiggg: {}
    }
    expect(() => new LocaleConfigValidator(localeConfigMispelledConfig).validate()).toThrow(UserError);
  });
});