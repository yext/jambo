const PageTemplateDirector = require('../../../src/commands/build/pagetemplatedirector');
const PageTemplate = require('../../../src/models/pagetemplate');
const LocalizationConfig = require('../../../src/models/localizationconfig');

describe('PageTemplateDirector directs PageTemplates and builds the expected object', () => {
  it('creates page templates correctly with no locale config', () => {
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
    const localeToPageTemplates = new PageTemplateDirector(new LocalizationConfig())
      .direct(pageTemplates);

    expect(localeToPageTemplates).toEqual({
      '': [
        new PageTemplate({
          pageName: 'path',
          locale: '',
          path: `pages/path.html.hbs`
        }),
        new PageTemplate({
          pageName: 'path2',
          locale: '',
          path: `pages/path2.html.hbs`
        }),
        new PageTemplate({
          pageName: 'path3',
          locale: '',
          path: `pages/path3.html.hbs`
        }),
      ]
    });
  });

  it('creates localeToPageTemplates with the correct locales and paths when locale data is provided', () => {
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
    const localeToPageTemplates = new PageTemplateDirector(new LocalizationConfig({
      default: 'it',
      localeConfig: {
        'en': {
          fallback: ['fr']
        },
        'es': {
          fallback: ['de', 'en']
        },
        'de': {
          fallback: ['fr', 'es']
        },
        'it': {},
        'fr': {}
      }
    })).direct(Object.values(pageTemplates));

    expect(localeToPageTemplates).toEqual({
      'en': [ // Directs to template with current locale even if fallbacks exist
        pageTemplates['en'],
      ],
      'es': [ // Locale fallbacks are not recursive
        new PageTemplate({
          pageName: pageTemplates['en'].getPageName(),
          locale: 'es',
          path: pageTemplates['en'].getPath()
        }),
      ],
      'de': [ // Directs to template with correct fallback locale
        new PageTemplate({
          pageName: pageTemplates['fr'].getPageName(),
          locale: 'de',
          path: pageTemplates['fr'].getPath()
        }),
      ],
      'fr': [ // Directs to template with current locale if present
        pageTemplates['fr'],
      ],
      'it': [], // Empty if no templates found for locale or fallbacks
    });
  });
});
