const extractTranslations = require('../../../src/i18n/extract/extracttranslations');
const fs = require('fs');
const path = require('path');
const expectedJson = require('../../fixtures/extract/expectedjson');
const { gettextToI18next } = require('i18next-conv');

/**
 * Helper for getting the parsed content of a .pot file.
 * @param {string} potFile 
 */
async function getI18nextJson(potFile) {
  const rawPot = fs.readFileSync(potFile);
  return gettextToI18next('en', rawPot)
    .then(jsonString => JSON.parse(jsonString));
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
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.hbs);
  });

  it('can extract translations from .js files', async () => {
    await extractTranslations({
      output: outputFile,
      files: [jsTranslationFile]
    });
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.js);
  });

  it('can extract all strings from a folder', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir]
    });
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.combined);
  });

  it('can ignore an entire folder', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir],
      ignore: [translationDir]
    });
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.empty);
  });

  it('can ignore a specific file when specifying a directory', async () => {
    const translationDir =
      path.relative(process.cwd(), path.join(fixturesDir));
    await extractTranslations({
      output: outputFile,
      directories: [translationDir],
      ignore: [jsTranslationFile]
    });
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.hbs);
  });

  it('ignoring a specific file takes priority over specifying that file', async () => {
    await extractTranslations({
      output: outputFile,
      files: [jsTranslationFile],
      ignore: [jsTranslationFile]
    });
    const i18nextJson = await getI18nextJson(outputFile);
    expect(i18nextJson).toEqual(expectedJson.empty);
  });
});
