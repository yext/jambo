const { PageConfig } = require('../../src/models/pageconfig');

describe('test page object is build properly with all data', () => {
  const pageName = 'test';
  const rawConfig = {
    config: 'test'
  };
  const locale = 'en';
  const pageConfig = new PageConfig({
    pageName: pageName,
    rawConfig: rawConfig,
    locale: locale
  })
  it('getPageName gets correct page name', () => {
    expect(pageConfig.getPageName()).toEqual(pageName);
  });
  it('getConfig gets config', () => {
    expect(pageConfig.getConfig()).toEqual(rawConfig);
  });
  it('getLocale returns locale', () => {
    expect(pageConfig.getLocale()).toEqual(locale);
  });
});

describe('test page object is build properly with missing locale', () => {
  const pageConfig = new PageConfig({
    pageName: 'test',
    rawConfig: {},
  })
  it('getLocale', () => {
    expect(pageConfig.getLocale()).toEqual('');
  });
});
