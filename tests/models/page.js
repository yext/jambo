const Page = require('../../src/models/page');
const PageConfig = require('../../src/models/pageconfig');
const PagePartial = require('../../src/models/pagepartial');

describe('Correctly forms Page object using static from', () => {
  const pageName = 'test';
  const pageExt = 'html';
  const locale = 'en';
  const rawConfig = {
    config: 'some config'
  };
  const partialPath = `pages/${pageName}.${locale}.${pageExt}.hbs`;
  const pageContents = '<html></html>';
  let page = Page.from({
    pageConfig: new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: rawConfig
    }),
    pagePartial: new PagePartial({
      pageName: pageName,
      locale: locale,
      path: partialPath,
      fileContents: pageContents
    }),
    urlFormatter: ((pageName, pageExt) => `${pageName}.${pageExt}.${pageExt}.aspx`),
  });

  it('page object is correct', () => {
    expect(page.getPageName()).toEqual(pageName);
    expect(page.getLocale()).toEqual(locale);
    expect(page.getConfig()).toEqual({
      ...rawConfig,
      url: page.getOutputPath()
    });
    expect(page.getPartialContents()).toEqual(pageContents);
    expect(page.getOutputPath()).toEqual(`${pageName}.${pageExt}.${pageExt}.aspx`);
  });
});
