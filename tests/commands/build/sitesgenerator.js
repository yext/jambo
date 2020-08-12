const { SitesGenerator } = require('../../../src/commands/build/sitesgenerator');

describe('SiteGenerator properly determines if files are valid', () => {
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
