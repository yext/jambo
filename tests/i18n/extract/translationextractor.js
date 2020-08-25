const TranslationExtractor = require('../../../src/i18n/extractor/translationextractor');
const path = require('path');
const fs = require('fs');


describe('TranslationExtractor', () => {
  const fixturesDir = path.resolve(__dirname, '../../fixtures/extractions');
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
    extractor.extract({
      specificFiles: [ rawtemplate ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawtemplatePot);
  });

  it('can extract from just a js file', () => {
    const rawcomponent =
      path.relative(process.cwd(), path.join(fixturesDir, 'rawcomponent.js'));
    extractor.extract({
      specificFiles: [ rawcomponent ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawcomponentPot);
  });

  it('can extract all translations from a folder', () => {
    extractor.extract({
      directories: [ fixturesDir ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(combinedPot);
  });

  it('can ignore an entire folder', async () => {
    extractor.extract({
      directories: [ fixturesDir ],
      ignoredPaths: [ fixturesDir ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(emptyPot);
  });

  it('can ignore a specific file when specifying a directory', () => {
    const rawcomponent = path.join(fixturesDir, 'rawcomponent.js');
    extractor.extract({
      directories: [ fixturesDir ],
      ignoredPaths: [ rawcomponent ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(rawtemplatePot);
  });

  it('ignoring a specific file takes priority over specifying that file', async () => {
    const rawcomponent =
      path.relative(process.cwd(), path.join(fixturesDir, 'rawcomponent.js'));
    extractor.extract({
      specificFiles: [ rawcomponent ],
      ignoredPaths: [ rawcomponent ]
    });
    const potString = extractor.getPotString();
    expect(potString).toEqual(emptyPot);
  });
});
