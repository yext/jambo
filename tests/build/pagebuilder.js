const { PageBuilder } = require('../../src/commands/build/pagebuilder');
const { PageTemplate } = require('../../src/models/pagetemplate');

describe('_filterPageTemplatesForLocale', () => {
  const pageTemplates = [ // TODO should we test with more than one thing in the array?
    new PageTemplate({
      filename: 'path.en.html.hbs',
      path: 'pages/path.en.html.hbs'
    }),
    new PageTemplate({
      filename: 'path.es.html.hbs',
      path: 'pages/path.es.html.hbs'
    }),
    new PageTemplate({
      filename: 'path.fr.html.hbs',
      path: 'pages/path.fr.html.hbs'
    }),
  ];

  it('choose page with current locale', () => {
    const currentLocale = 'es';

    const filteredTemplates = new PageBuilder({})
      ._filterPageTemplatesForLocale(pageTemplates, currentLocale);

    expect(filteredTemplates).toEqual([
      new PageTemplate({
        filename: `path.${currentLocale}.html.hbs`,
        path: `pages/path.${currentLocale}.html.hbs`
      }),
    ]);
  });


  it('choose page with current locale if exists even if fallbacks also exist', () => {
    const currentLocale = 'es';

    const filteredTemplates = new PageBuilder({})
      ._filterPageTemplatesForLocale(pageTemplates, currentLocale, [ 'fr', 'es' ]);

    expect(filteredTemplates).toEqual([
      new PageTemplate({
        filename: `path.${currentLocale}.html.hbs`,
        path: `pages/path.${currentLocale}.html.hbs`
      })
    ]);
  });

  it('choose page with fallback locale when no match', () => {
    const localeWithNoMatch = 'de';
    const fallbackLocale = 'fr';

    const filteredTemplates = new PageBuilder({})
      ._filterPageTemplatesForLocale(pageTemplates, localeWithNoMatch, [ fallbackLocale ]);

    expect(filteredTemplates).toEqual([
      new PageTemplate({
        filename: `path.${fallbackLocale}.html.hbs`,
        path: `pages/path.${fallbackLocale}.html.hbs`
      })
    ]);
  });

  it('choose page with correct order fallback locale when no match', () => {
    const localeWithNoMatch = 'de';
    const firstFallbackLocale = 'fr';
    const secondFallbackLocale = 'es';

    const filteredTemplates = new PageBuilder({})
      ._filterPageTemplatesForLocale(pageTemplates, localeWithNoMatch, [ firstFallbackLocale, secondFallbackLocale ]);


    expect(filteredTemplates).toEqual([
      new PageTemplate({
        filename: `path.${firstFallbackLocale}.html.hbs`,
        path: `pages/path.${firstFallbackLocale}.html.hbs`
      })
    ]);
  });

  it('do not generate page when there is no match and no fallbacks', () => {
    const filteredTemplates = new PageBuilder({})
      ._filterPageTemplatesForLocale(pageTemplates, 'de');

    expect(filteredTemplates).toEqual([]);
  });
});

describe('buildPages', () => {
  it('buildPages', () => {
    expect('todo').toEqual('do this');
  });
});

describe('_getUniquePageNames', () => {
  it('_getUniquePageNames', () => {
    const pageTemplates = [
      new PageTemplate({
        filename: 'test.es.html.hbs',
      }),
      new PageTemplate({
        filename: 'test.html.hbs',
      }),
    ];
    let uniquePageIds = new PageBuilder({})._getUniquePageNames(pageTemplates);
    expect(uniquePageIds).toEqual(['test']);

    pageTemplates.push(new PageTemplate({
      filename: 'new.es.html.hbs',
    }));
    uniquePageIds = new PageBuilder({})._getUniquePageNames(pageTemplates);
    expect(uniquePageIds).toEqual(['test', 'new']);
  });
});