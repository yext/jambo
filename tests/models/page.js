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
  const templateContents = '<html></html>';
  let page = Page.from({
    pageConfig: new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: rawConfig
    }),
    pageTemplate: new PageTemplate({
      pageName: pageName,
      locale: locale,
      path: templatePath,
      fileContents: templateContents
    }),
    urlFormatter: ((pageName, pageExt) => `${pageName}.${pageExt}.${pageExt}.aspx`),
  });

  it('page object is correct', () => {
    expect(page.getName()).toEqual(pageName);
    expect(page.getLocale()).toEqual(locale);
    expect(page.getConfig()).toEqual({
      ...rawConfig,
      url: page.getOutputPath()
    });
    expect(page.getTemplateContents()).toEqual(templateContents);
    expect(page.getOutputPath()).toEqual(`${pageName}.${pageExt}.${pageExt}.aspx`);
  });
});
