const { Page } = require('../../src/models/page');
const { PageConfig } = require('../../src/models/pageconfig');
const { PageTemplate } = require('../../src/models/pagetemplate');

describe('testing Page object', () => {
  const pageName = 'test';
  const locale = 'en';
  const rawConfig = {
    config: 'some config'
  };
  const templatePath = `pages/${pageName}.${locale}.html.hbs`;
  let page = new Page({
    config: new PageConfig({
      pageName: pageName,
      locale: locale,
      rawConfig: rawConfig
    }),
    pageTemplate: new PageTemplate({
      filename: `${pageName}.${locale}.html.hbs`,
      path: templatePath
    }),
    urlFormatter: () => {}
  });

  it('getPageName', () => {
    expect(page.getPageName()).toEqual(pageName);
  });

  it('getConfig', () => {
    expect(page.getConfig()).toEqual(rawConfig);
  });

  it('getTemplatePath', () => {
    expect(page.getTemplatePath()).toEqual(templatePath);
  });
});

describe('getOutputPath', () => {
  it('uses url formatter function and parses extension correctly from templatePath', () => {
    const url = new Page({
      config: new PageConfig({
        pageName: 'name',
        locale: '',
        rawConfig: {}
      }),
      pageTemplate: new PageTemplate({
        filename: 'name.html.hbs',
        path: 'pages/name.html.hbs'
      }),
      urlFormatter: ((pageName, pageExt) => `${pageName}.${pageExt}.${pageExt}.aspx`),
    }).getOutputPath();

    expect(url).toEqual('name.html.html.aspx');
  });
});
