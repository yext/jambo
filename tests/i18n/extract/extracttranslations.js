const extractTranslations = require('../../../src/i18n/extract/extracttranslations');
const fs = require('fs');
const path = require('path');
const gettextParser = require('gettext-parser');
const expectedPot = require('../../fixtures/extract/expectedpot');

/**
 * Helper for getting the parsed content of a .pot file.
 * @param {string} potFile 
 */
function getPotContent(potFile) {
  const rawPot = fs.readFileSync(potFile);
  const pot = gettextParser.po.parse(rawPot);
  return pot.translations[''];
}

describe('extractTranslations', () => {
  const fixturesDir = path.resolve(__dirname, '../../fixtures/extract')
  const outputFile = path.join(fixturesDir, 'actual.pot');
  const hbsTranslationFile =
    path.relative(process.cwd(), path.join(fixturesDir, 'translations.hbs'));
  const jsTranslationFile =
    path.relative(process.cwd(), path.join(fixturesDir, 'translations.js'));

  afterEach(() => {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  });

  it('can extract translations from .hbs files', async () => {
    await extractTranslations({
      output: outputFile,
      files: [hbsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.hbs);
  });

  it('can extract translations from .js files', async () => {
    await extractTranslations({
      output: outputFile,
      files: [jsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.js);
  });

  it('can extract all strings from a folder', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.combined);
  });

  it('can ignore an entire folder', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir],
      ignore: [translationDir]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.empty);
  });

  it('can ignore a specific js file', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir],
      ignore: [jsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.hbs);
  });

  it('ignoring a specific js file takes priority over the file', async () => {
    await extractTranslations({
      output: outputFile,
      files: [jsTranslationFile],
      ignore: [jsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.empty);
  });

  it('can ignore a specific hbs file', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir],
      ignore: [hbsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.js);
  });

  it('ignoring a specific hbs file takes priority over the file', async () => {
    await extractTranslations({
      output: outputFile,
      files: [hbsTranslationFile],
      ignore: [hbsTranslationFile]
    });
    expect(getPotContent(outputFile)).toEqual(expectedPot.empty);
  });
});
