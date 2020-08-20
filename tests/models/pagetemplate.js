const PagePartial = require('../../src/models/pagetemplate');

describe('Correctly forms PagePartial object using static from', () => {
  it('PagePartial is built properly when locale is present', () => {
    const pageName = 'pageName';
    const locale = 'en';
    const partialPath = `pages/${pageName}.${locale}.html.hbs`;
    const pagePartial = PagePartial.from(`${pageName}.${locale}.html.hbs`, partialPath);

    expect(pagePartial.getPageName()).toEqual(pageName);
    expect(pagePartial.getLocale()).toEqual(locale);
    expect(partialPath).toEqual(partialPath);
  });

  it('PagePartial is built properly with no locale', () => {
    const pageName = 'pageName';
    const partialPath = `pages/${pageName}.html.hbs`;
    const pagePartial = PagePartial.from(`${pageName}.html.hbs`, partialPath);

    expect(pagePartial.getPageName()).toEqual(pageName);
    expect(pagePartial.getLocale()).toEqual('');
    expect(partialPath).toEqual(partialPath);
  });
});

describe('Correctly forms PagePartial object from constructor', () => {
  it('PagePartial is built properly when locale is present', () => {
    const partial = new PagePartial({
      pageName: 'test',
      locale: 'es'
    });
    expect(partial.getLocale()).toEqual('es');
    expect(partial.getPageName()).toEqual('test');
  });

  it('PagePartial is built properly when locale is absent', () => {
    const partial = new PagePartial({
      pageName: 'test',
    });
    expect(partial.getLocale()).toEqual('');
    expect(partial.getPageName()).toEqual('test');
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