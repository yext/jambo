const { SitesGenerator } = require('../../src/commands/build/sitesgenerator');

describe('_getPageId', () => {
  it('_getPageId', () => {
    let pageSetCreator = new SitesGenerator();
    let pageId = 'test';
    let filename = `${pageId}.html.hbs`;

    expect(pageSetCreator._getPageId(filename)).toEqual(pageId);

    let filename2 = `${pageId}.locale.html.hbs`;
    expect(pageSetCreator._getPageId(filename2)).toEqual(pageId);
  });
});

describe('_getLocale', () => {
  it('returns locale when locale is present', () => {
    let filename = 'test.en.html.hbs';
    let locale = new SitesGenerator()._getLocale(filename);
    expect(locale).toEqual('en');
  });

  it('returns false when locale is not present', () => {
    let filename = 'test.html.hbs';
    let locale = new SitesGenerator()._getLocale(filename);
    expect(locale).toEqual(false);
  });
});

describe('_isValidFile', () => {
  it('returns false for a .gitkeep file', () => {
    let filename = '.gitkeep';
    let isValid = new SitesGenerator()._isValidFile(filename);
    expect(isValid).toEqual(false);
  });

  it('returns true for an .html.hbs file', () => {
    let filename = 'example.html.hbs';
    let isValid = new SitesGenerator()._isValidFile(filename);
    expect(isValid).toEqual(true);
  });
});
