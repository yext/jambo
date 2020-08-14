const { stripExtension, getPageName } = require('../../src/utils/fileutils');

describe('stripExtension correctly strips extension from filename', () => {
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

describe('Gets page name', () => {
  it('gets page name from filename', () => {
    const pageName = 'pageName';
    let filename = `${pageName}.html.hbs`;

    expect(getPageName(filename)).toEqual(pageName);

    let filenameWithLocale = `${pageName}.locale.html.hbs`;
    expect(getPageName(filenameWithLocale)).toEqual(pageName);
  });

  it('gets page name from configName', () => {
    const configName = 'config';

    expect(getPageName(configName)).toEqual(configName);

    let configNameWithLocale = `${configName}.fr`;
    expect(getPageName(configNameWithLocale)).toEqual(configName);
  });
});
