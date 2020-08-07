const { PageTemplate } = require('../../src/models/pagetemplate');

describe('getPageName', () => {
  it('gets page name with locale', () => {
    let pageName = 'test';
    let pageSetCreator = new PageTemplate({
      filename: `${pageName}.html.hbs`,
    });

    expect(pageSetCreator.getPageName()).toEqual(pageName);
  });

  it('gets page name without locale', () => {
    let pageName = 'test';
    let pageSetCreator = new PageTemplate({
      filename: `${pageName}.locale.html.hbs`,
    });
    expect(pageSetCreator.getPageName()).toEqual(pageName);
  });
});

describe('getLocale', () => {
  it('returns locale when locale is present', () => {
    let locale = new PageTemplate({
      filename: 'test.en.html.hbs'
    }).getLocale();
    expect(locale).toEqual('en');
  });

  it('returns \'\' when locale is not present', () => {
    let locale = new PageTemplate({
      filename: 'test.html.hbs'
    }).getLocale();
    expect(locale).toEqual('');
  });
});


describe('getTemplatePath', () => {
  it('works', () => {
    let templatePath = new PageTemplate({
      filename: 'test.html.hbs',
      path: 'pages/test.html.hbs'
    }).getTemplatePath();
    expect(templatePath).toEqual('pages/test.html.hbs');
  });
});