const { getPageId, getLocaleForPage } = require('../utils/fileutils');

exports.PageTemplate = class {
  constructor({filename, path}) {
    if (!filename) {
      throw new Error('Error: no filename provided for page template');
    }

    this.path = path;
    this.pageId = getPageId(filename);
    this.locale = getLocaleForPage(filename) || '';
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
}