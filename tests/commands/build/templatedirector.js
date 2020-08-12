const TemplateDirector = require('../../../src/commands/build/templatedirector');
const PageTemplate = require('../../../src/models/pagetemplate');

describe('TemplateDirector directs PageTemplates and builds the expected object', () => {
  it('creates localeToPageTemplates properly when locale data is absent', () => {
    const defaultLocale = 'en';
    const pageTemplates = [
      new PageTemplate({
        pageName: 'path',
        path: `pages/path.html.hbs`
      }),
      new PageTemplate({
        pageName: 'path2',
        path: `pages/path2.html.hbs`
      }),
      new PageTemplate({
        pageName: 'path3',
        path: `pages/path3.html.hbs`
      }),
    ];
    const localeToPageTemplates = new TemplateDirector({
      locales: [],
      localeToFallbacks: {},
      defaultLocale: defaultLocale
    }).direct(pageTemplates);

    expect(localeToPageTemplates).toEqual({
      [defaultLocale]: [
        new PageTemplate({
          pageName: 'path',
          locale: defaultLocale,
          path: `pages/path.html.hbs`
        }),
        new PageTemplate({
          pageName: 'path2',
          locale: defaultLocale,
          path: `pages/path2.html.hbs`
        }),
        new PageTemplate({
          pageName: 'path3',
          locale: defaultLocale,
          path: `pages/path3.html.hbs`
        }),
      ]
    });
  });

  it('creates localeToPageTemplates with the correct locales and paths when locale data is provided', () => {
    const locales = ['en', 'es', 'fr', 'de'];
    const localeToFallbacks = {
      'es': ['fr', 'en'],
      'de': ['fr', 'es']
    };
    const pageTemplates = [
      new PageTemplate({
        pageName: 'path',
        locale: locales[0],
        path: `pages/path.${locales[0]}.html.hbs`
      }),
      new PageTemplate({
        pageName: 'path',
        locale: locales[1],
        path: `pages/path.${locales[1]}.html.hbs`
      }),
      new PageTemplate({
        pageName: 'path',
        locale: locales[2],
        path: `pages/path.${locales[2]}.html.hbs`
      }),
    ];
    const localeToPageTemplates = new TemplateDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks,
    }).direct(pageTemplates);

    expect(localeToPageTemplates).toEqual({
      'en': [
        new PageTemplate({
          pageName: 'path',
          locale: 'en',
          path: `pages/path.en.html.hbs`
        }),
      ],
      'es': [
        new PageTemplate({
          pageName: 'path',
          locale: 'es',
          path: `pages/path.es.html.hbs`
        }),
      ],
      'de': [
        new PageTemplate({
          pageName: 'path',
          locale: 'de',
          path: `pages/path.fr.html.hbs` // Using fallbacks
        }),
      ],
      'fr': [
        new PageTemplate({
          pageName: 'path',
          locale: 'fr',
          path: `pages/path.fr.html.hbs`
        }),
      ],
    });
  });
});

describe('Finds the correct PageTemplate given locale information', () => {
  const locales = ['en', 'es', 'fr', 'de'];
  const localeToFallbacks = {
    'es': ['fr', 'en'],
    'de': ['fr', 'es']
  };
  const localeToPageTemplate = {
    en: new PageTemplate({
      locale: 'en',
    }),
    de: new PageTemplate({
      locale: 'de',
    }),
    fr: new PageTemplate({
      locale: 'fr',
    }),
  };
  const pageTemplates = [
    localeToPageTemplate['en'],
    localeToPageTemplate['fr'],
    localeToPageTemplate['de']
  ];

  it('finds template with current locale even if fallbacks exist', () => {
    const locale = 'de';

    const template = new TemplateDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks
    })._findPageTemplateForLocale(locale, pageTemplates);

    expect(template).toEqual(localeToPageTemplate[locale]);
  });

  it('finds template correct fallback locale', () => {
    const currentLocale = 'es';

    const template = new TemplateDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks
    })._findPageTemplateForLocale(currentLocale, pageTemplates);

    expect(template).toEqual(
      new PageTemplate({
        locale: localeToFallbacks[currentLocale][0],
      })
    );
  });

  it('returns undefined when there is no template for given locale', () => {
    const locale = 'fake locale';

    const template = new TemplateDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks
    })._findPageTemplateForLocale(locale, pageTemplates);

    expect(template).toEqual(undefined);
  });
});
