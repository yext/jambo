const PageConfig = require('../../../src/models/pageconfig');
const PageConfigDecorator = require('../../../src/commands/build/pageconfigdecorator');
const LocalizationConfig = require('../../../src/models/localizationconfig');
const { NO_LOCALE } = require('../../../src/constants');

describe('PageConfigDecorator adds proper attributes to PageConfigs', () => {
  it('builds decorated pages configs correctly when there is no locale config', () => {
    const localeConfig = new LocalizationConfig();
    const decoratedConfigs = new PageConfigDecorator(localeConfig).decorate([
      new PageConfig({
        pageName: 'pageName1',
        rawConfig: { verticalKey: 'verticalKey' },
      }),
      new PageConfig({
        pageName: 'pageName2',
        rawConfig: { pageTitle: 'pageTitle' },
      })
    ]);

    expect(decoratedConfigs).toEqual({
      [NO_LOCALE]: [
        new PageConfig({
          locale: NO_LOCALE,
          pageName: 'pageName1',
          rawConfig: { verticalKey: 'verticalKey' },
        }),
        new PageConfig({
          locale: NO_LOCALE,
          pageName: 'pageName2',
          rawConfig: { pageTitle: 'pageTitle' },
        })
      ]
    });
  });

  it('decorates pages configs correctly with multiple locales and fallbacks', () => {
    const defaultLocale = 'es';
    const configForDefaultLocale = new PageConfig({
      pageName: 'pageName',
      rawConfig: {
        defaultConfigOption: 'ex',
      }
    });
    const frConfig = new PageConfig({
      pageName: 'pageName',
      locale: 'fr',
      rawConfig: {
        frConfigOption: 'ex',
        test: 'fr_test'
      }
    });
    const itConfig1 = new PageConfig({
      pageName: 'pageName',
      locale: 'it',
      rawConfig: {
        itConfigOption: 'ex',
        test: 'it_test'
      },
    });
    const itConfig2 = new PageConfig({
      pageName: 'pageName2',
      locale: 'it',
      rawConfig: {
        itConfigOption: 'ex',
        test: 'it_test'
      },
    });
    const decoratedConfig = new PageConfigDecorator(new LocalizationConfig({
      default: defaultLocale,
      localeConfig: {
        [defaultLocale]: {},
        fr: {
          fallback: [ 'it', 'de' ]
        },
        de: {
          fallback: [ 'it' ],
        }
      }
    })).decorate([
      configForDefaultLocale,
      frConfig,
      itConfig1,
      itConfig2,
      new PageConfig({
        pageName: 'pageName',
        locale: 'de',
        rawConfig: {
          deConfigOption: 'ex',
          test: 'de_test'
        },
      }),
    ]);

    expect(decoratedConfig).toEqual({
      [defaultLocale]: [
        new PageConfig({ // Default config remains undecorated
          pageName: configForDefaultLocale.getPageName(),
          locale: defaultLocale,
          rawConfig: {
            defaultConfigOption: 'ex',
          },
        }),
      ],
      [frConfig.getLocale()]: [
        new PageConfig({ // Multiple fallbacks, add default config
          pageName: frConfig.getPageName(),
          locale: frConfig.getLocale(),
          rawConfig: {
            frConfigOption: 'ex',
            test: 'fr_test',
            itConfigOption: 'ex',
            deConfigOption: 'ex',
            defaultConfigOption: 'ex',
          },
        }),
      ],
      de: [
        new PageConfig({ // One fallbacks, add default config
          pageName: 'pageName',
          locale: 'de',
          rawConfig: {
            deConfigOption: 'ex',
            test: 'de_test',
            itConfigOption: 'ex',
            defaultConfigOption: 'ex',
          },
        }),
      ],
      it: [
        new PageConfig({ // No fallbacks, add default config
          pageName: itConfig1.getPageName(),
          locale: itConfig1.getLocale(),
          rawConfig: {
            itConfigOption: 'ex',
            test: 'it_test',
            defaultConfigOption: 'ex',
          },
        }),
        new PageConfig({ // No fallbacks, no default config
          pageName: itConfig2.getPageName(),
          locale: itConfig2.getLocale(),
          rawConfig: {
            itConfigOption: 'ex',
            test: 'it_test',
          },
        }),
      ],
    });
  });
});

describe('Merges the internals of multiple PageConfigs', () => {
  it('merging order is respected, objects later have preference', () => {
    const configs = [
      {
        verticalKey: 'default',
        verticalKey1: 'default'
      },
      {
         verticalKey: 'FR'
      },
    ];
    const decoratedConfig = new PageConfigDecorator({})._merge(configs);

    expect(decoratedConfig).toEqual({
      verticalKey: 'FR',
      verticalKey1: 'default'
    });
  });

  it('this is a shallow merge', () => {
    const config1 = { a: { b: 'b' } };
    const config2 = { a: { a: 'a' } };
    const decoratedConfigs = new PageConfigDecorator({})._merge([
      config1,
      config2
    ]);

    expect(decoratedConfigs).toEqual(config2);
  });
});

describe('Matches locales properly', () => {
  const defaultLocale = 'fr';
  const pageConfigDecorator = new PageConfigDecorator(
    new LocalizationConfig({
      default: defaultLocale
    })
  );

  it('default config matches if locale is not specified', () => {
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, defaultLocale))
      .toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, '')).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch('', undefined)).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch('es', undefined)).toEqual(false);
  });

  it('matching non-default config works', () => {
    expect(pageConfigDecorator._isLocaleMatch('es', 'es')).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, 'es')).toEqual(false);
  });
});
