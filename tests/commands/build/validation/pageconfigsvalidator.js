const PageConfigsConfigValidator = require('../../../../src/commands/build/validation/pageconfigsvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('PageConfigValidator works properly', () => {
  const config = {
    'test.fr': {},
    test: {}
  }

  const configWithMoreLanguages = {
    'test.it': {},
    'test.es': {},
    'test.fr': {},
    test: {}
  }

  const configuredLocales = ['en', 'fr'];

  it('does not throw an error for a correct config', () => {
    expect(() => new PageConfigsConfigValidator(config, configuredLocales).validate()).not.toThrow(UserError);
  });

  it('throws a user error when locales are referenced by page configs but they aren\'t configured', () => {
    expect(() => new PageConfigsConfigValidator(configWithMoreLanguages, configuredLocales).validate()).toThrow(UserError);
  });
});