const PagePartialDirector = require('../../../src/commands/build/pagetemplatedirector');
const PagePartial = require('../../../src/models/pagetemplate');

describe('PagePartialDirector directs PagePartials and builds the expected object', () => {
  it('creates page partials correctly when only defaultLocale is present', () => {
    const defaultLocale = 'en';
    const pagePartials = [
      new PagePartial({
        pageName: 'path',
        path: `pages/path.html.hbs`
      }),
      new PagePartial({
        pageName: 'path2',
        path: `pages/path2.html.hbs`
      }),
      new PagePartial({
        pageName: 'path3',
        path: `pages/path3.html.hbs`
      }),
    ];
    const localeToPagePartials = new PagePartialDirector({
      locales: [],
      localeToFallbacks: {},
      defaultLocale: defaultLocale
    }).direct(pagePartials);

    expect(localeToPagePartials).toEqual({
      [defaultLocale]: [
        new PagePartial({
          pageName: 'path',
          locale: defaultLocale,
          path: `pages/path.html.hbs`
        }),
        new PagePartial({
          pageName: 'path2',
          locale: defaultLocale,
          path: `pages/path2.html.hbs`
        }),
        new PagePartial({
          pageName: 'path3',
          locale: defaultLocale,
          path: `pages/path3.html.hbs`
        }),
      ]
    });
  });

  it('creates localeToPagePartials with the correct locales and paths when locale data is provided', () => {
    const locales = ['en', 'es', 'fr', 'de', 'it'];
    const localeToFallbacks = {
      'en': ['fr'],
      'es': ['de', 'en'],
      'de': ['fr', 'es']
    };
    const pagePartials = {
      en: new PagePartial({
        pageName: 'path',
        locale: 'en',
        path: `pages/path.en.html.hbs`
      }),
      fr: new PagePartial({
        pageName: 'path',
        locale: 'fr',
        path: `pages/path.fr.html.hbs`
      }),
    };
    const localeToPagePartials = new PagePartialDirector({
      locales: locales,
      localeToFallbacks: localeToFallbacks,
    }).direct(Object.values(pagePartials));

    expect(localeToPagePartials).toEqual({
      'en': [ // Directs to partial with current locale even if fallbacks exist
        pagePartials['en'],
      ],
      'es': [ // Locale fallbacks are not recursive
        new PagePartial({
          pageName: pagePartials['en'].getPageName(),
          locale: 'es',
          path: pagePartials['en'].getPath()
        }),
      ],
      'de': [ // Directs to partial with correct fallback locale
        new PagePartial({
          pageName: pagePartials['fr'].getPageName(),
          locale: 'de',
          path: pagePartials['fr'].getPath()
        }),
      ],
      'fr': [ // Directs to partial with current locale if present
        pagePartials['fr'],
      ],
      'it': [], // Empty if no partials found for locale or fallbacks
    });
  });
});
