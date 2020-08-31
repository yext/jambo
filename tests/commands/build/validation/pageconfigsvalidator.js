const PageConfigsConfigValidator = require('../../../../src/commands/build/validation/pageconfigsvalidator');
const UserError = require('../../../../src/errors/usererror');

describe('PageConfigValidator works properly', () => {
  it('does not throw an error for a correct config', () => {
    const config = {
      'test.fr': {},
      test: {}
    };
    const configuredLocales = ['en', 'fr'];
    expect(() => new PageConfigsConfigValidator(config, configuredLocales).validate()).not.toThrow(UserError);
  });

  it('throws a user error when locales are referenced by page configs but they aren\'t configured', () => {
    const configWithMoreLanguages = {
      'test.it': {},
      'test.es': {},
      'test.fr': {},
      test: {}
    }
    const configuredLocales = ['en', 'fr'];
    expect(() => new PageConfigsConfigValidator(configWithMoreLanguages, configuredLocales).validate()).toThrow(UserError);
  });
});