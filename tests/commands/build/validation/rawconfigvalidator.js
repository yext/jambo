const RawConfigValidator = require('../../../../src/commands/build/validation/rawconfigvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('RawConfigValidator works properly', () => {
  const multiLangConfig = {
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

  const singleLangConfig = {
    global_config: {},
    index: {},
    faqs: {},
    people: {}
  }

  it('does not throw an error with a correct multi-language config', () => {
    expect(() => new RawConfigValidator(multiLangConfig).validate()).not.toThrow(UserError);
  });

  it('does not throw an error with a correct single-language config', () => {
    expect(() => new RawConfigValidator(singleLangConfig).validate()).not.toThrow(UserError);
  });

  it('_isMultiLanguageSite returns true for multilang sites', () => {
    expect(new RawConfigValidator(multiLangConfig)._isMultiLanguageSite()).toBeTruthy();
  })

  it('_isMultiLanguageSite returns false for single language sites', () => {
    expect(new RawConfigValidator(singleLangConfig)._isMultiLanguageSite()).toBeFalsy();
  })
});