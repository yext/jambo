const PagePartial = require('../../src/models/pagetemplate');

describe('Correctly forms PagePartial object using static from', () => {
  it('PagePartial is built properly when locale is present', () => {
    const pageName = 'pageName';
    const locale = 'en';
    const templatePath = `pages/${pageName}.${locale}.html.hbs`;
    const pagePartial = PagePartial.from(`${pageName}.${locale}.html.hbs`, templatePath);

    expect(pagePartial.getPageName()).toEqual(pageName);
    expect(pagePartial.getLocale()).toEqual(locale);
    expect(templatePath).toEqual(templatePath);
  });

  it('PagePartial is built properly with no locale', () => {
    const pageName = 'pageName';
    const templatePath = `pages/${pageName}.html.hbs`;
    const pagePartial = PagePartial.from(`${pageName}.html.hbs`, templatePath);

    expect(pagePartial.getPageName()).toEqual(pageName);
    expect(pagePartial.getLocale()).toEqual('');
    expect(templatePath).toEqual(templatePath);
  });
});

describe('Correctly forms PagePartial object from constructor', () => {
  it('PagePartial is built properly when locale is present', () => {
    const template = new PagePartial({
      pageName: 'test',
      locale: 'es'
    });
    expect(template.getLocale()).toEqual('es');
    expect(template.getPageName()).toEqual('test');
  });

  it('PagePartial is built properly when locale is absent', () => {
    const template = new PagePartial({
      pageName: 'test',
    });
    expect(template.getLocale()).toEqual('');
    expect(template.getPageName()).toEqual('test');
  });
});

describe('PagePartial parses locale from filename', () => {
  it('parses correctly when locale is absent', () => {
    const locale = PagePartial.parseLocale('test.html.hbs');
    expect(locale).toEqual(false);
  });

  it('parses correctly when there is a locale', () => {
    const locale = PagePartial.parseLocale('test.fr-CH.html.hbs');
    expect(locale).toEqual('fr-CH');
  });
});