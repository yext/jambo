const path = require('path');
const { readFileSync } = require('fs');
const { gettextToI18next } = require('i18next-conv');

/**
 * This class parses translations from a local .PO file. The i18next-conv
 * library is used to put the translations in i18next format.
 */
class LocalFileParser {
  /**
   * Creates a new instance of {@link LocalFileParser}.
   * 
   * @param {string} translationsDir The local directory containing .PO files.
   * @param {Object<string,?>} options Used to optionally configure the i18next-conv
   *                                   library.
  */
  constructor(translationsDir, options) {
    this._translationsDir = translationsDir;
    this._options = options;
  }

  /**
   * Parses a locale's translations in the local filesystem.
   * 
   * @param {string} locale The desired locale.
   * @returns {Promise<Object>} A Promise containing the parsed translations in
   *                            i18next format.
  */
  async fetch(locale) {
    const translationFile = path.join(this._translationsDir, `${locale}.po`);
    const localeTranslations =
      gettextToI18next(locale, readFileSync(translationFile), this._options);
    return localeTranslations.then(data => JSON.parse(data));
  }
}
module.exports = LocalFileParser;