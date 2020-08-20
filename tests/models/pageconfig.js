const PageConfig = require('../../src/models/pageconfig');
const { NO_LOCALE } = require('../../src/constants');

describe('Properly builds PageConfig object', () => {
  const pageName = 'test';
  const rawConfig = {
    config: 'test'
  };
  it('builds correctly with all data', () => {
    const locale = 'en';
    const pageConfig = new PageConfig({
      pageName: pageName,
      rawConfig: rawConfig,
      locale: locale
    })
    expect(pageConfig.getPageName()).toEqual(pageName);
    expect(pageConfig.getConfig()).toEqual(rawConfig);
    expect(pageConfig.getLocale()).toEqual(locale);
  });

  it('builds correctly with missing locale', () => {
    const pageConfig = new PageConfig({
      pageName: pageName,
      rawConfig: rawConfig,
    })
    expect(pageConfig.getPageName()).toEqual(pageName);
    expect(pageConfig.getLocale()).toEqual(NO_LOCALE);
    expect(pageConfig.getConfig()).toEqual(rawConfig);
  });
});
