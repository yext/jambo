const RawConfigValidator = require('../../src/validation/rawconfigvalidator');
const UserError = require('../../src/errors/usererror');

describe('RawConfigValidator works properly', () => {
  it('does not throw an error with a correct multi-language config', () => {
    const config = {
      global_config: {},
      locale_config: {
        default: 'en',
        localeConfig: {
          en: {},
          fr: {},
          es: {}
        },
      },
      index: {},
      faqs: {},
      people: {},
      'index.fr': {},
      'faqs.fr': {},
      'people.fr': {},
      'index.es': {},
      'faqs.es': {},
      'people.es': {}
    }
    expect(() => new RawConfigValidator(config).validate()).not.toThrow();
  });

  it('does not throw an error with a correct single-language config', () => {
    const config = {
      global_config: {},
      index: {},
      faqs: {},
      people: {}
    }
    expect(() => new RawConfigValidator(config).validate()).not.toThrow();
  });

  it('throws a user error with an invalid config', () => {
    const config = {}
    expect(() => new RawConfigValidator(config).validate()).toThrow(UserError);
  });
});