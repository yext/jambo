const { stripExtension } = require('../../src/utils/fileutils');

describe('stripExtension', () => {
  it('strips extension when present', () => {
    let filename = 'example.html.hbs';
    let strippedFilename = stripExtension(filename);
    expect(strippedFilename).toEqual('example.html');
  });

  it('returns regular string if there is no extension to strip', () => {
    let filename = 'example';
    let strippedFilename = stripExtension(filename);
    expect(strippedFilename).toEqual('example');
  });
});

// describe('_getPageId', () => {
//   it('_getPageId', () => {
//     let filteredTemplates = new PageBuilder({});
//     let filename = `${pageName}.html.hbs`;

//     expect(pageBuilder._getPageId(filename)).toEqual(pageName);

//     let filename2 = `${pageName}.locale.html.hbs`;
//     expect(pageBuilder._getPageId(filename2)).toEqual(pageName);
//   });
// });

// describe('_getLocale', () => {
//   it('returns locale when locale is present', () => {
//     let filename = 'test.en.html.hbs';
//     let locale = new PageBuilder()._getLocale(filename);
//     expect(locale).toEqual('en');
//   });

//   it('returns false when locale is not present', () => {
//     let filename = 'test.html.hbs';
//     let locale = new PageBuilder()._getLocale(filename);
//     expect(locale).toEqual(false);
//   });
// });
