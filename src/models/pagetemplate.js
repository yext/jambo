const { getPageName } = require('../utils/fileutils');

exports.PageTemplate = class {
  constructor({ filename, path }) {
    if (!filename) {
      throw new Error('Error: no filename provided for page template');
    }

    this.path = path;
    this.pageName = getPageName(filename);
    this.locale = this._parseLocale(filename) || ''; // TODO do we want this fallback
  }

  /**
   * Returns the pageName
   *
   * @returns {String} pageName
   */
  getPageName() {
    return this.pageName;
  }

  /**
   * Returns the template path
   *
   * @returns {String} template path
   */
  getTemplatePath() {
    return this.path;
  }

  /**
   * Returns the locale
   *
   * @returns {String} locale
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {string} filename the file name of the page handlebars template
   * @returns {string}
   */
  _parseLocale (filename) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }
}
