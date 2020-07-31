const { getPageId } = require('../utils/fileutils');

exports.PageTemplate = class {
  constructor({filename, path, defaultLocale}) {
    if (!filename) {
      throw new Error('Error: no filename provided for page template');
    }

    this.path = path;
    this.pageId = getPageId(filename);
    this.locale = this._getLocale(filename) || defaultLocale || '';
  }

  getPageId() {
    return this.pageId;
  }

  getTemplatePath() {
    return this.path;
  }

  getLocale() {
    return this.locale;
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {string} filename the file name of the page handlebars template
   * @returns {string}
   */
  _getLocale (filename) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }
}
