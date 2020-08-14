const TemplateDirector = require('../../../src/commands/build/templatedirector');
const PageTemplate = require('../../../src/models/pagetemplate');

describe('TemplateDirector directs PageTemplates and builds the expected object', () => {
  it('creates page templates correctly when only defaultLocale is present', () => {
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
    const locales = ['en', 'es', 'fr', 'de', 'it'];
    const localeToFallbacks = {
      'en': ['fr'],
      'es': ['de', 'en'],
      'de': ['fr', 'es']
    };
    const pageTemplates = {
      en: new PageTemplate({
        pageName: 'path',
        locale: 'en',
        path: `pages/path.en.html.hbs`
      }),
      fr: new PageTemplate({
        pageName: 'path',
        locale: 'fr',
        path: `pages/path.fr.html.hbs`
      }),
    };
    const localeToPageTemplates = new TemplateDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks,
    }).direct(Object.values(pageTemplates));

    expect(localeToPageTemplates).toEqual({
      'en': [ // Directs to template with current locale even if fallbacks exist
        pageTemplates['en'],
      ],
      'es': [ // Locale fallbacks are not recursive
        new PageTemplate({
          pageName: pageTemplates['en'].getPageName(),
          locale: 'es',
          path: pageTemplates['en'].getTemplatePath()
        }),
      ],
      'de': [ // Directs to template with correct fallback locale
        new PageTemplate({
          pageName: pageTemplates['fr'].getPageName(),
          locale: 'de',
          path: pageTemplates['fr'].getTemplatePath()
        }),
      ],
      'fr': [ // Directs to template with current locale if present
        pageTemplates['fr'],
      ],
      'it': [], // Empty if no templates found for locale or fallbacks
    });
  });
});
