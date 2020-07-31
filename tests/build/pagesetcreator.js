const { PageSetCreator } = require('../../src/commands/build/pagesetcreator');

describe('getPageIdToPath', () => {
  it('choose page with current locale', () => {
    let pages = [
      {
        path: 'path_en.html',
        pageId: 'test',
        locale: 'en'
      },
      {
        path: 'path_es.html',
        pageId: 'test',
        locale: 'es'
      },
      {
        path: 'path_fr.html',
        pageId: 'test',
        locale: 'fr'
      },
    ];
    let pageSetCreator = new PageSetCreator();
    let pageIdToPath = pageSetCreator.getPageIdToPath(pages, 'es');

    expect(pageIdToPath).toEqual({
      test: 'path_es.html'
    });
  });

  it('choose page with fallback locale', () => {
    let pages = [
      {
        path: 'path_en.html',
        pageId: 'test',
        locale: 'en'
      },
      {
        path: 'path_es.html',
        pageId: 'test',
        locale: 'es'
      },
      {
        path: 'path_fr.html',
        pageId: 'test',
        locale: 'fr'
      },
    ];
    let pageSetCreator = new PageSetCreator();
    let pageIdToPath = pageSetCreator.getPageIdToPath(pages, 'en-US', [ 'fr' ]);


    expect(pageIdToPath).toEqual({
      test: 'path_fr.html'
    });
  });

  it('choose page with correct order fallback locale', () => {
    let pages = [
      {
        path: 'path.html',
        pageId: 'test',
        locale: ''
      },
      {
        path: 'path_en.html',
        pageId: 'test',
        locale: 'en'
      },
      {
        path: 'path_es.html',
        pageId: 'test',
        locale: 'es'
      },
      {
        path: 'path_fr.html',
        pageId: 'test',
        locale: 'fr'
      },
    ];
    let pageSetCreator = new PageSetCreator();
    let pageIdToPath = pageSetCreator.getPageIdToPath(pages, 'en-US', [ 'fr', 'es' ]);


    expect(pageIdToPath).toEqual({
      test: 'path_fr.html'
    });
  });

  it('chooses page without locale when there is no match', () => {
    let pages = [
      {
        path: 'path.html',
        pageId: 'test',
        locale: ''
      },
      {
        path: 'path_en.html',
        pageId: 'test',
        locale: 'en'
      },
      {
        path: 'path_es.html',
        pageId: 'test',
        locale: 'es'
      },
      {
        path: 'path_fr.html',
        pageId: 'test',
        locale: 'fr'
      },
    ];
    let pageSetCreator = new PageSetCreator();
    let pageIdToPath = pageSetCreator.getPageIdToPath(pages, 'en-US');


    expect(pageIdToPath).toEqual({
      test: 'path.html'
    });
  });
});




describe('_getUniquePageIds', () => {
  it('_getUniquePageIds', () => {
    let pages = [
      {
        pageId: 'test',
      },
      {
        pageId: 'test',
      },
    ];
    let uniquePageIds = new PageSetCreator()._getUniquePageIds(pages);
    expect(uniquePageIds).toEqual(['test']);

    pages.push({ pageId: 'new' });
    uniquePageIds = new PageSetCreator()._getUniquePageIds(pages);
    expect(uniquePageIds).toEqual(['test', 'new']);
  });
});
