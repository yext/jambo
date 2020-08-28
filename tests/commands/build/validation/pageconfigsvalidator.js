const PageConfigsConfigValidator = require('../../../../src/commands/build/validation/pageconfigsvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('PageConfigValidator works properly', () => {
  const config = {
    locale_config: {
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
    },
    'test.fr': {},
    test: {}
  }

  const invalidConfig = {
    locale_config: {
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
    },
    'test.es': {},
    'test.fr': {},
    test: {}
  }

  it('does not throw an error for a correct config', () => {
    expect(() => new PageConfigsConfigValidator(config).validate()).not.toThrow(UserError);
  });

  it('throws a user error when a localeConfig is not defined', () => {
    expect(() => new PageConfigsConfigValidator(invalidConfig).validate()).toThrow(UserError);
  });
});