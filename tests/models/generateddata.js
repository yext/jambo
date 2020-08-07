const { GeneratedData } = require('../../src/models/generateddata');
const { LocalizationConfig } = require('../../src/models/localizationconfig');

describe('Merging localizationConfig and globalConfig works correctly', () => {
  it('merging config doesn\'t transform globalConfig or localizationConfig', () => {
    const locale = 'en';
    const localizationConfig = new LocalizationConfig({
      localeConfig: {
        'en': {
          apiKey: 'test',
          experienceKey: 'test',
        }
      }
    });
    const globalConfig = {
      apiKey: 'test1',
      experienceKey: 'test1',
      locale: 'en-US'
    };

    const localizationConfigCopy = { ...localizationConfig }; // TODO does this even work?
    const globalConfigCopy = { ...globalConfig };
    let _ = new GeneratedData({
      globalConfig: globalConfig,
      localizationConfig: localizationConfig,
    }).getGlobalConfig(locale);

    return expect(localizationConfig).toEqual(localizationConfigCopy) &&
      expect(globalConfig).toEqual(globalConfigCopy);
  });

  it('locale config overrides global config', () => {
    const locale = 'en';
    const localizationConfig = new LocalizationConfig({
      localeConfig: {
        'en': {
          apiKey: 'apiKey',
          experienceKey: 'expKey',
        }
      }
    });
    const globalConfig = {
      apiKey: 'gApiKey',
      experienceKey: 'gExpKey',
      locale: 'en-US'
    };

    const mergedConfig = new GeneratedData({
      globalConfig: globalConfig,
      localizationConfig: localizationConfig
    }).getGlobalConfig(locale);

    return expect(mergedConfig).toEqual({
      apiKey: localizationConfig.getApiKey(locale),
      experienceKey: localizationConfig.getExperienceKey(locale),
      locale: locale
    });
  });

  it('global config is used when locale config is missing data', () => {
    const locale = 'en';
    const localizationConfig = new LocalizationConfig({
      localeConfig: {
        'en': {
          experienceKey: 'expKey',
        }
      }
    });
    const globalConfig = {
      apiKey: 'gApiKey',
      experienceKey: 'gExpKey',
      locale: 'en-US'
    };

    const mergedConfig = new GeneratedData({
      globalConfig: globalConfig,
      localizationConfig: localizationConfig,
    }).getGlobalConfig(locale);

    return expect(mergedConfig).toEqual({
      apiKey: globalConfig.apiKey,
      experienceKey: localizationConfig.getExperienceKey(locale),
      locale: locale
    });
  });

  it('global config is used when locale config is missing entirely', () => {
    const globalConfig = {
      apiKey: 'test1',
      experienceKey: 'test1',
      locale: 'en-US'
    };

    const mergedConfig = new GeneratedData({
      globalConfig: globalConfig,
      localizationConfig: new LocalizationConfig()
    }).getGlobalConfig();

    return expect(mergedConfig).toEqual({
      apiKey: globalConfig.apiKey,
      experienceKey: globalConfig.experienceKey,
      locale: globalConfig.locale
    });
  });
});


describe('getLocales', () => {
  it('gets locales from localization config', () => {
    const localizationConfig = new LocalizationConfig({
      localeConfig: {
        'en': {},
        'es': {},
        'de': {},
      }
    });

    const locales = new GeneratedData({
      globalConfig: {},
      localizationConfig: localizationConfig
    }).getLocales();

    return expect(locales).toEqual(['en', 'es', 'de']);
  });

  it('gets default locale from localization config', () => {
    const localizationConfig = new LocalizationConfig({
      default: 'en'
    });

    const locales = new GeneratedData({
      globalConfig: {},
      localizationConfig: localizationConfig
    }).getLocales();

    return expect(locales).toEqual(['en']);
  });

  it('gets from global config', () => {
    const locales = new GeneratedData({
      globalConfig: {
        locale: 'de'
      },
      localizationConfig: new LocalizationConfig()
    }).getLocales();

    return expect(locales).toEqual(['de']);
  });
});

describe('getPageConfigs', () => {
  it('works', () => {
    expect('TODO').toEqual('');
  });
});

describe('buildPageSet', () => {
  it('works', () => {
    expect('TODO').toEqual('');
  });
});

