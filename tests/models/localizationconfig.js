const { LocalizationConfig } = require("../../src/models/localizationconfig");

describe('getUrlFormatter', () => {
  it('getUrlFormatter default works', () => {
    let locale = 'en';
    let localeConfig = new LocalizationConfig({
      default: locale,
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    let urlFormatter = localeConfig.getUrlFormatter(locale);
    expect(urlFormatter('pageName', 'pageExt')).toEqual('pages/pageName.pageExt');
  });

  it('getUrlFormatter base locale format works', () => {
    let localeConfig = new LocalizationConfig({
      default: 'fake',
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    let locale = 'en';
    let urlFormatter = localeConfig.getUrlFormatter(locale);
    expect(urlFormatter('pageName', 'pageExt')).toEqual(`pages/${locale}/pageName.pageExt`);
  });

  it('getUrlFormatter overrides work', () => {
    let urlOverridePattern = 'test';
    let config = new LocalizationConfig({
      default: 'en',
      localeConfig: {
        'en': {
          urlOverride: urlOverridePattern
        }
      },
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    let basicFormatter = config.getUrlFormatter('en');
    expect(basicFormatter('pageName', 'pageExt')).toEqual(urlOverridePattern);

    config = new LocalizationConfig({
      default: 'en',
      localeConfig: {
        'en-US': {
          urlOverride: '{language}/{locale}/{pageName}.{pageExt}'
        }
      },
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });
    let fancyFormatter = config.getUrlFormatter('en-US');
    expect(fancyFormatter('pageName', 'pageExt')).toEqual('en/en-US/pageName.pageExt');
  });
});

describe('localeToConfig accessors', () => {
  const localeToConfig = {
    locale: {
      experienceKey: 'experienceKey',
      apiKey: 'apiKey',
      params: {
        example: 'param'
      },
      urlOverride: '{pageName}',
      translationFile: 'path/to/file.po',
      fallback: ['locale2']
    },
    locale2: {
      experienceKey: 'experienceKey2',
      apiKey: 'apiKey2',
      params: {
        example: 'param2'
      },
      urlOverride: '{pageName}2',
      translationFile: 'path/to/file.po2',
      fallback: []
    }
  };

  const localizationConfig = new LocalizationConfig({
    localeConfig: localeToConfig
  });

  it('getLocales', () => {
    expect(localizationConfig.getLocales()).toEqual(['locale', 'locale2']);
  });

  it('getApiKey', () => {
    let locale = 'locale';
    expect(localizationConfig.getApiKey(locale))
      .toEqual(localeToConfig[locale].apiKey);

    locale = 'locale2';
    expect(localizationConfig.getApiKey(locale))
      .toEqual(localeToConfig[locale].apiKey);
  });

  it('getExperienceKey', () => {
    let locale = 'locale';
    expect(localizationConfig.getExperienceKey(locale))
      .toEqual(localeToConfig[locale].experienceKey);

    locale = 'locale2';
    expect(localizationConfig.getExperienceKey(locale))
      .toEqual(localeToConfig[locale].experienceKey);
  });

  it('getParams', () => {
    let locale = 'locale';
    expect(localizationConfig.getParams(locale))
      .toEqual(localeToConfig[locale].params);

    locale = 'locale2';
    expect(localizationConfig.getParams(locale))
      .toEqual(localeToConfig[locale].params);
  });

  it('getTranslationFile', () => {
    let locale = 'locale';
    expect(localizationConfig.getTranslationFile(locale))
      .toEqual(localeToConfig[locale].translationFile);

    locale = 'locale2';
    expect(localizationConfig.getTranslationFile(locale))
      .toEqual(localeToConfig[locale].translationFile);
  });

  it('getFallbacks', () => {
    let locale = 'locale';
    expect(localizationConfig.getFallbacks(locale))
      .toEqual(localeToConfig[locale].fallback);

    locale = 'locale2';
    expect(localizationConfig.getFallbacks(locale))
      .toEqual(localeToConfig[locale].fallback);
  });
});


