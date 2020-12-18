const LocalizationConfig = require('../../src/models/localizationconfig');

describe('LocalizationConfig is properly built from raw object', () => {
  it('Localization Object is built properly', () => {
    const rawLocalizationConfig = {
      default: 'es',
      localeConfig: {
        en: {
          experienceKey: 'experienceKey',
          params: {
            example: 'param'
          },
          urlOverride: '{pageName}',
          translationFile: 'path/to/file.po',
          fallback: ['es']
        },
        es: {
          experienceKey: 'en should not fallback to this'
        }
      }
    };
    const localizationConfig = new LocalizationConfig(rawLocalizationConfig);
    const locale = 'en';

    expect(localizationConfig.getLocales()).toEqual(['en', 'es']);
    expect(localizationConfig.getTranslationFile(locale))
      .toEqual(rawLocalizationConfig.localeConfig[locale].translationFile);
    expect(localizationConfig.getFallbacks(locale))
      .toEqual(rawLocalizationConfig.localeConfig[locale].fallback);
  });
});


describe('Getting URL Formatting function works properly', () => {
  it('falls back to "pageName.pageExt" when no localization config provided', () => {
    let locale = 'en';
    let localizationConfig = new LocalizationConfig();

    let urlFormatter = localizationConfig.getUrlFormatter(locale);
    expect(urlFormatter('pageName', 'pageExt')).toEqual('pageName.pageExt');
  });

  it('applies default url formatting pattern to default locale', () => {
    let locale = 'en';
    let localizationConfig = new LocalizationConfig({
      default: locale,
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    let urlFormatter = localizationConfig.getUrlFormatter(locale);
    expect(urlFormatter('pageName', 'pageExt'))
      .toEqual(`pages/${locale}/pageName.pageExt`);
  });

  it('applies correct url formatting pattern to non-default locales', () => {
    let localizationConfig = new LocalizationConfig({
      default: 'fake',
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    let locale = 'en';
    let urlFormatter = localizationConfig.getUrlFormatter(locale);
    expect(urlFormatter('pageName', 'pageExt')).toEqual('pages/pageName.pageExt');
  });

  it('applies correct url formatting pattern for locale with urlOverride', () => {
    let urlOverridePattern = 'test';
    let config = new LocalizationConfig({
      default: 'en',
      localeConfig: {
        en: {
          urlOverride: urlOverridePattern
        }
      },
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });

    const basicFormatter = config.getUrlFormatter('en');
    expect(basicFormatter('pageName', 'pageExt')).toEqual(urlOverridePattern);

    config = new LocalizationConfig({
      default: 'en',
      localeConfig: {
        en: {},
        en_US: {
          urlOverride: '{language}/{locale}/{pageName}.{pageExt}'
        }
      },
      urlFormat: {
        baseLocale: 'pages/{pageName}.{pageExt}',
        default: 'pages/{locale}/{pageName}.{pageExt}'
      }
    });
    const complicatedFormatter = config.getUrlFormatter('en_US');
    expect(complicatedFormatter('pageName', 'pageExt'))
      .toEqual('en/en_US/pageName.pageExt');
  });
});