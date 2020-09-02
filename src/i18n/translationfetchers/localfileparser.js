const path = require('path');
const { readFileSync, existsSync } = require('fs');
const { gettextToI18next } = require('i18next-conv');
const UserError = require('../../errors/usererror');

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
   * Extracts a locale's translations from the local filesystem. If no such
   * translations exist, an empty object is returned.
   *
   * @param {string} locale The desired locale.
   * @param {string} translationFilePath The path to the translation file locale within
   *                                     the translations directory; if not present,
   *                                     defaults to [locale].po
   * @returns {Promise<Object>} A Promise containing the parsed translations in
   *                            i18next format.
  */
  async fetch(locale, translationFilePath) {
    const fileName = translationFilePath || `${locale}.po`;
    const translationFile = path.join(this._translationsDir, fileName);
    if (!existsSync(translationFile)) {
      throw new UserError(`Cannot find translation file for '${locale}' at '${translationFile}'`);
    }

    const localeTranslations =
      gettextToI18next(locale, readFileSync(translationFile), this._options);
    return localeTranslations.then(data => JSON.parse(data));
  }
}
module.exports = LocalFileParser;