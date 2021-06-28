const TranslationExtractor = require('../../../src/i18n/extractor/translationextractor');
const path = require('path');
const fs = require('fs');

describe('TranslationExtractor', () => {
  const rootDir = path.resolve(__dirname, '../../..');
  const fixturesAbsPath = path.resolve(__dirname, '../../fixtures/extractions');
  const fixturesDir = path.relative(rootDir, fixturesAbsPath);

  const rawcomponentPot = readExpectedPot('rawcomponent.pot');
  const combinedPot = readExpectedPot('combined.pot');
  const rawtemplatePot = readExpectedPot('rawtemplate.pot');
  const emptyPot = readExpectedPot('empty.pot');

  function readExpectedPot(filename) {
    return fs.readFileSync(path.join(fixturesDir, filename)).toString();
  }

  let extractor;
  beforeEach(() => {
    extractor = new TranslationExtractor({
      baseDirectory: path.resolve(__dirname, '../../..')
    });
  });

  it('can extract from just an hbs file', () => {
    const rawtemplate =
      path.relative(process.cwd(), path.join(fixturesDir, 'rawtemplate.hbs'));
    extractor.extract([ rawtemplate ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawtemplatePot);
  });

  it('can extract from just a js file', () => {
    const rawcomponent =
      path.relative(process.cwd(), path.join(fixturesDir, 'rawcomponent.js'));
    extractor.extract([ rawcomponent ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawcomponentPot);
  });

  it('can extract all translations from a folder', () => {
    extractor.extract([ fixturesDir ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(combinedPot);
  });

  it('can ignore an entire folder', async () => {
    extractor.extract([ fixturesDir, `!${fixturesDir}` ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(emptyPot);
  });

  it('can ignore a specific file when specifying a directory', () => {
    const rawcomponent = path.join(fixturesDir, 'rawcomponent.js');
    extractor.extract([ fixturesDir, `!${rawcomponent}` ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawtemplatePot);
  });

  it('ignoring a specific file takes priority over specifying that file', async () => {
    const rawcomponent =
      path.relative(process.cwd(), path.join(fixturesDir, 'rawcomponent.js'));
    extractor.extract([ rawcomponent, `!${rawcomponent}` ]);
    const potString = extractor.getPotString();
    expect(potString).toEqual(emptyPot);
  });
});
