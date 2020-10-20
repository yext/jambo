const PageTemplate = require('../../src/models/pagetemplate');
const { NO_LOCALE } = require('../../src/constants');

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
    expect(template.getLocale()).toEqual(NO_LOCALE);
    expect(template.getPageName()).toEqual('test');
  });
});

describe('PageTemplate parses locale from filename', () => {
  it('parses correctly when locale is absent', () => {
    const locale = PageTemplate.parseLocale('test.html.hbs');
    expect(locale).toBeFalsy();
  });

  it('parses correctly when there is a locale', () => {
    const locale = PageTemplate.parseLocale('test.fr_CH.html.hbs');
    expect(locale).toEqual('fr_CH');
  });
});