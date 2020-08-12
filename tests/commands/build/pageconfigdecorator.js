const PageConfig = require('../../../src/models/pageconfig');
const PageConfigDecorator = require('../../../src/commands/build/pageconfigdecorator');

describe('PageConfigDecorator decorates PageConfigs and builds the expected object', () => {
  it('builds locale to configs with decorated configs when no locales specified', () => {
    const defaultLocale = 'en';
    const decoratedConfigs = new PageConfigDecorator({
      localeToFallbacks: {},
      defaultLocale: defaultLocale
    }).decorate([
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
      [defaultLocale]: [
        new PageConfig({
          locale: defaultLocale,
          pageName: 'pageName1',
          rawConfig: { verticalKey: 'verticalKey' },
        }),
        new PageConfig({
          locale: defaultLocale,
          pageName: 'pageName2',
          rawConfig: { pageTitle: 'pageTitle' },
        })
      ]
    });
  });

  it('builds locale to configs with decorated configs with given locales', () => {
    const defaultLocale = 'en';
    const decoratedConfigs = new PageConfigDecorator({
      localeToFallbacks: {},
      defaultLocale: defaultLocale
    }).decorate([
      new PageConfig({
        pageName: 'example',
        rawConfig: { verticalKey: 'default' },
      }),
      new PageConfig({
        pageName: 'example',
        locale: 'fr',
        rawConfig: { verticalKey: 'FR' },
      }),
    ]);

    expect(decoratedConfigs).toEqual({
      [defaultLocale]: [
        new PageConfig({
          pageName: 'example',
          locale: defaultLocale,
          rawConfig: { verticalKey: 'default' },
        }),
      ],
      fr: [
        new PageConfig({
          pageName: 'example',
          locale: 'fr',
          rawConfig: { verticalKey: 'FR' },
        }),
      ],
    });
  });

  it('decorated config props override regular config props', () => {
    const defaultLocale = 'en';
    const configs = [
      new PageConfig({
        pageName: 'example',
        rawConfig: {
          nestedObject: {
            verticalKey: ['default'],
            verticalKey1: 'default'
          },
          verticalKey1: {
            verticalKey: 'default'
          },
        }
      }),
      new PageConfig({
        pageName: 'example',
        locale: 'fr',
        rawConfig: {
          nestedObject: {
            verticalKey: 'example',
          }
        }
      }),
    ];

    let decoratedConfig = new PageConfigDecorator({
      localeToFallbacks: {},
      defaultLocale: defaultLocale
    }).decorate(configs);

    expect(decoratedConfig).toEqual({
      [defaultLocale] : [
        new PageConfig({
          pageName: 'example',
          locale: defaultLocale,
          rawConfig: {
            nestedObject: {
              verticalKey: ['default'],
              verticalKey1: 'default'
            },
            verticalKey1: {
              verticalKey: 'default'
            },
          },
        }),
      ],
      fr : [
        new PageConfig({
          pageName: 'example',
          locale: 'fr',
          rawConfig: {
            nestedObject: {
              verticalKey: 'example',
            },
            verticalKey1: {
              verticalKey: 'default'
            },
          },
        }),
      ],
    });
  });
});

describe('Decorating a single PageConfig works properly', () => {
  const defaultConfig = 'es';
  const pageConfigDecorator = new PageConfigDecorator({
    localeToFallbacks: {
      fr: [ 'en', 'de' ],
      de: [ 'it' ],
    },
    defaultLocale: defaultConfig
  });
  const frenchPageConfig = new PageConfig({
    pageName: 'example',
    locale: 'fr',
    rawConfig: {
      verticalKey: 'verticalKey'
    },
  });
  const germanPageConfig = new PageConfig({
    pageName: 'example',
    locale: 'de',
    rawConfig: {
      componentSettings: 'componentSettings'
    },
  });
  let configs = [
    frenchPageConfig,
    germanPageConfig,
    new PageConfig({
      pageName: 'example',
      locale: defaultConfig,
      rawConfig: {
        defaultConfigExample: {
          test: 'test1'
        },
      }
    }),
    new PageConfig({
      pageName: 'example',
      locale: 'it',
      rawConfig: {
        pageTitle: 'pageTitle'
      },
    }),
    new PageConfig({
      pageName: 'example',
      locale: 'en',
      rawConfig: {
        example: 'ex'
      },
    }),
  ];

  it('decorating config with fallback and default config works', () => {
    const mergedConfig = pageConfigDecorator._decoratePageConfig(frenchPageConfig, configs);
    expect(mergedConfig).toEqual(
      new PageConfig({
        pageName: 'example',
        locale: 'fr',
        rawConfig: {
          example: 'ex',
          defaultConfigExample: {
            test: 'test1'
          },
          verticalKey: 'verticalKey',
          componentSettings: 'componentSettings',
        },
      }),
    );
  });

  it('fallbacks of fallbacks are not included in decorated config', () => {
    let mergedConfig = pageConfigDecorator._decoratePageConfig(germanPageConfig, configs);
    expect(mergedConfig).toEqual(
      new PageConfig({
        pageName: 'example',
        locale: 'de',
        rawConfig: {
          componentSettings: 'componentSettings',
          pageTitle: 'pageTitle',
          defaultConfigExample: {
            test: 'test1'
          }
        },
      }),
    );
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
  const pageConfigDecorator = new PageConfigDecorator({
    defaultLocale: defaultLocale
  });

  it('default config matches if locale is not specified', () => {
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, defaultLocale)).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, '')).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch('', undefined)).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch('es', undefined)).toEqual(false);
  });

  it('matching non-default config works', () => {
    expect(pageConfigDecorator._isLocaleMatch('es', 'es')).toEqual(true);
    expect(pageConfigDecorator._isLocaleMatch(defaultLocale, 'es')).toEqual(false);
  });
});
