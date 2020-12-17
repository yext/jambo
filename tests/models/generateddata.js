const GeneratedData = require('../../src/models/generateddata');
const GlobalConfig = require('../../src/models/globalconfig');
const LocalizationConfig = require('../../src/models/localizationconfig');
const PageConfig = require('../../src/models/pageconfig');
const PageTemplate = require('../../src/models/pagetemplate');
const PageSet = require('../../src/models/pageset');
const Page = require('../../src/models/page');
const { NO_LOCALE } = require('../../src/constants');

describe('GeneratedData is correctly formed using with static from', () => {
  it('works if no LocalizationConfig provided and no pages - initial repo state', () => {
    const generatedData = GeneratedData.from({
      globalConfig: new GlobalConfig({
        locale: 'en',
        apiKey: 'g_apiKey',
        experienceKey: 'g_experienceKey',
      }),
      localizationConfig: new LocalizationConfig(),
      pageConfigs: [],
      pageTemplates: []
    });

    expect(generatedData.getLocales()).toEqual([]);
    expect(generatedData.getPageSets()).toEqual([]);
  });

  it('builds object correctly if no LocalizationConfig provided', () => {
    const locale = 'de';
    const pageConfig1 = new PageConfig({
      pageName: 'page1',
      rawConfig: { config: 'test' }
    });
    const pageConfig2 = new PageConfig({
      pageName: 'page2',
      rawConfig: { config: 'test' }
    });
    const pageTemplate1 = new PageTemplate({
      pageName: 'page1',
      path: 'fakepath.html.hbs'
    });
    const pageTemplate2 = new PageTemplate({
      pageName: 'page2',
      path: 'fakepath2.html.hbs'
    });
    const globalConfig = new GlobalConfig({
      locale: locale,
      apiKey: 'g_apiKey',
      experienceKey: 'g_experienceKey',
    });

    const generatedData = GeneratedData.from({
      globalConfig: globalConfig,
      localizationConfig: new LocalizationConfig(),
      pageConfigs: [
        pageConfig1,
        pageConfig2
      ],
      pageTemplates: [
        pageTemplate1,
        pageTemplate2
      ]
    });

    expect(generatedData.getLocales()).toEqual([]);
    expect(generatedData.getPageSets()).toEqual([
      new PageSet({
        locale: NO_LOCALE,
        pages: [
          new Page({
            pageConfig: new PageConfig({
              locale: NO_LOCALE,
              pageName: pageConfig1.getPageName(),
              rawConfig: pageConfig1.getConfig(),
            }),
            pageTemplate: new PageTemplate({
              locale: NO_LOCALE,
              pageName: pageTemplate1.getPageName(),
              path: pageTemplate1.getPath(),
            }),
            outputPath: `${pageConfig1.getPageName()}.html`
          }),
          new Page({
            pageConfig: new PageConfig({
              locale: NO_LOCALE,
              pageName: pageConfig2.getPageName(),
              rawConfig: pageConfig2.getConfig(),
            }),
            pageTemplate: new PageTemplate({
              locale: NO_LOCALE,
              pageName: pageTemplate2.getPageName(),
              path: pageTemplate2.getPath(),
            }),
            outputPath: `${pageConfig2.getPageName()}.html`
          }),
        ],
        globalConfig: globalConfig,
        localizationConfig: new LocalizationConfig()
      })
    ]);
    expect(generatedData.getLocaleFallbacks(locale)).toEqual([]);
  });

  it('forms properly if LocalizationConfig is provided', () => {
    const globalConfig = new GlobalConfig({
      locale: 'en',
      apiKey: 'g_apiKey',
      experienceKey: 'g_experienceKey',
    });
    const localizationConfig = new LocalizationConfig({
      default: 'en',
      localeConfig: {
        en: {},
        fr: {
          fallback: [
            'en'
          ]
        },
        es: {
          fallback: [
            'en'
          ]
        },
        it: {
          fallback: [
            'en'
          ]
        }
      },
      urlFormat: {
        default: '/en/{pageName}.{pageExt}'
      }
    });
    const pageConfigs = [
      new PageConfig({
        pageName: 'home',
        locale: 'en',
        rawConfig: {
          test: 'config'
        }
      }),
      new PageConfig({
        pageName: 'faqs',
        locale: 'fr',
        rawConfig: {
          test: 'config'
        }
      }),
      new PageConfig({
        pageName: 'home',
        locale: 'es',
        rawConfig: {
          test: 'config'
        }
      }),
      new PageConfig({
        pageName: 'links',
        locale: 'es',
        rawConfig: {
          test: 'config'
        }
      }),
      new PageConfig({
        pageName: 'locations',
        locale: 'es',
        rawConfig: {
          test: 'config'
        }
      })
    ];
    const pageTemplates = [
      new PageTemplate({
        pageName: 'home',
        path: 'pages/home.html.hbs',
      }),
      new PageTemplate({
        pageName: 'faqs',
        locale: 'fr',
        path: 'pages/faqs.fr.html.hbs',
      }),
      new PageTemplate({
        pageName: 'links',
        locale: 'es',
        path: 'pages/links.es.html.hbs',
      }),
      new PageTemplate({
        pageName: 'locations',
        locale: 'es',
        path: 'pages/locations.es.html.hbs',
      })
    ];
    const generatedData = GeneratedData.from({
      globalConfig: globalConfig,
      localizationConfig: localizationConfig,
      pageConfigs: pageConfigs,
      pageTemplates: pageTemplates
    });
    expect(generatedData.getLocales()).toEqual(localizationConfig.getLocales());
    expect(generatedData.getPageSets()).toEqual([
      new PageSet({
        locale: 'en',
        pages: [
          new Page({
            pageConfig: new PageConfig({
              locale: 'en',
              pageName: 'home',
              rawConfig: { test: 'config' },
            }),
            pageTemplate: new PageTemplate({
              locale: 'en',
              pageName: 'home',
              path: 'pages/home.html.hbs',
            }),
            outputPath: '/en/home.html'
          }),
        ],
        globalConfig: globalConfig,
        currentLocaleConfig: {}
      }),
      new PageSet({
        locale: 'es',
        pages: [
          new Page({
            pageConfig: new PageConfig({
              locale: 'es',
              pageName: 'home',
              rawConfig: { test: 'config' },
            }),
            pageTemplate: new PageTemplate({
              locale: 'es',
              pageName: 'home',
              path: 'pages/home.html.hbs',
            }),
            outputPath: 'home.html'
          }),
          new Page({
            pageConfig: new PageConfig({
              locale: 'es',
              pageName: 'links',
              rawConfig: { test: 'config' },
            }),
            pageTemplate: new PageTemplate({
              locale: 'es',
              pageName: 'links',
              path: 'pages/links.es.html.hbs',
            }),
            outputPath: 'links.html'
          }),
          new Page({
            pageConfig: new PageConfig({
              locale: 'es',
              pageName: 'locations',
              rawConfig: { test: 'config' },
            }),
            pageTemplate: new PageTemplate({
              locale: 'es',
              pageName: 'locations',
              path: 'pages/locations.es.html.hbs',
            }),
            outputPath: 'locations.html'
          })
        ],
        globalConfig: globalConfig,
        currentLocaleConfig: {
          fallback: [
            'en'
          ]
        }
      }),
      new PageSet({
        locale: 'fr',
        pages: [
          new Page({
            pageConfig: new PageConfig({
              locale: 'fr',
              pageName: 'faqs',
              rawConfig: { test: 'config' },
            }),
            pageTemplate: new PageTemplate({
              locale: 'fr',
              pageName: 'faqs',
              path: 'pages/faqs.fr.html.hbs',
            }),
            outputPath: 'faqs.html'
          })
        ],
        globalConfig: globalConfig,
        currentLocaleConfig: {
          fallback: [
            'en'
          ]
        }
      }),
    ]);

    for (const locale of localizationConfig.getFallbacks()) {
      expect(generatedData.getLocaleFallbacks(locale))
        .toEqual(localizationConfig.getFallbacks(locale));
    }
  });
});

