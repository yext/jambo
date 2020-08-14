const Page = require('../../src/models/page');
const PageConfig = require('../../src/models/pageconfig');
const PageTemplate = require('../../src/models/pagetemplate');

describe('Correctly forms Page object using static from', () => {
  const pageName = 'test';
  const pageExt = 'html';
  const locale = 'en';
  const rawConfig = {
    config: 'some config'
  };
  const templatePath = `pages/${pageName}.${locale}.${pageExt}.hbs`;
  let page = Page.from({
    pageConfig: new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: rawConfig
    }),
    pageTemplate: new PageTemplate({
      pageName: pageName,
      locale: locale,
      path: templatePath
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
    expect(page.getTemplatePath()).toEqual(templatePath);
    expect(page.getOutputPath()).toEqual(`${pageName}.${pageExt}.${pageExt}.aspx`);
  });
});
