const {
  stripExtension,
  getPageName,
  isValidFile,
  isValidPartialPath,
  searchDirectoryIgnoringExtensions
} = require('../../src/utils/fileutils');

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

describe('isValidFile properly determines if files are valid', () => {
  it('returns false for a .gitkeep file', () => {
    let filename = '.gitkeep';
    let isValid = isValidFile(filename);
    expect(isValid).toEqual(false);
  });

  it('returns true for an .html.hbs file', () => {
    let filename = 'example.html.hbs';
    let isValid = isValidFile(filename);
    expect(isValid).toEqual(true);
  });
});

describe('isValidPartialPath properly determines if paths are valid', () => {
  const blacklistedPaths = ['.git', 'node_modules'];
  blacklistedPaths.forEach(blacklistedPath => {
    it(`returns true when a path does not contain /${blacklistedPath}/`, () => {
      let path = '../answers-hitchhiker-theme/partials/index.hbs';
      let isValid = isValidPartialPath(path);
      expect(isValid).toEqual(true);
    });
  
    it(`returns false when a path contains /${blacklistedPath}/`, () => {
      let path =
        `../../answers-hitchhiker-theme/test-site/${blacklistedPath}/yargs/index.js`;
      let isValid = isValidPartialPath(path);
      expect(isValid).toEqual(false);
    });
  
    it(`returns false when a path starts with ${blacklistedPath}/`, () => {
      let path = `${blacklistedPath}/handlebars/index.js`;
      let isValid = isValidPartialPath(path);
      expect(isValid).toEqual(false);
    });
  });
});

describe('searchDirectoryIgnoringExtensions', () => {
  it('can find "fileutils.js" when looking for "fileutils"', () => {
    const fileUtilsFileName = searchDirectoryIgnoringExtensions('fileutils', __dirname);
    expect(fileUtilsFileName).toEqual('fileutils.js');
  });

  it('will return undefined when it cannot find the file', () => {
    const cannotFindFile = searchDirectoryIgnoringExtensions('asdf', __dirname);
    expect(cannotFindFile).toEqual(undefined);
  });
});