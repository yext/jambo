const PageTemplate = require('../../src/models/pagetemplate');

describe('Correctly forms PageTemplate object using static from', () => {
  it('PageTemplate is built properly when locale is present', () => {
    const pageName = 'pageName';
    const locale = 'en';
    const templatePath = `pages/${pageName}.${locale}.html.hbs`;
    const pageTemplate = PageTemplate.from(`${pageName}.${locale}.html.hbs`, templatePath);

    expect(pageTemplate.getPageName()).toEqual(pageName);
    expect(pageTemplate.getLocale()).toEqual(locale);
    expect(templatePath).toEqual(templatePath);
  });

  it('PageTemplate is built properly with no locale', () => {
    const pageName = 'pageName';
    const templatePath = `pages/${pageName}.html.hbs`;
    const pageTemplate = PageTemplate.from(`${pageName}.html.hbs`, templatePath);

    expect(pageTemplate.getPageName()).toEqual(pageName);
    expect(pageTemplate.getLocale()).toEqual('');
    expect(templatePath).toEqual(templatePath);
  });
});

describe('Correctly forms PageTemplate object from constructor', () => {
  it('PageTemplate is built properly when locale is present', () => {
    const template = new PageTemplate({
      pageName: 'test',
      locale: 'es'
    });
    expect(template.getLocale()).toEqual('es');
    expect(template.getPageName()).toEqual('test');
  });

  it('PageTemplate is built properly when locale is absent', () => {
    const template = new PageTemplate({
      pageName: 'test',
    });
    expect(template.getLocale()).toEqual('');
    expect(template.getPageName()).toEqual('test');
  });
});

describe('PageTemplate parses locale from filename', () => {
  it('parses correctly when locale is absent', () => {
    const locale = PageTemplate.parseLocale('test.html.hbs');
    expect(locale).toEqual(false);
  });

  it('parses correctly when there is a locale', () => {
    const locale = PageTemplate.parseLocale('test.fr-CH.html.hbs');
    expect(locale).toEqual('fr-CH');
  });
});