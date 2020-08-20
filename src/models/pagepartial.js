const { getPageName } = require('../utils/fileutils');
const Partial = require('./partial');
const SystemError = require('../errors/systemerror');

/**
 * PagePartial represents a Handlebars partial that is used to
 * generate a page.
 */
module.exports = class PagePartial extends Partial {
  constructor({ path, fileContents, pageName, locale }) {
    super(path, fileContents);

    /**
     * @type {String}
     */
    this.pageName = pageName;

    /**
     * @type {String}
     */
    this.locale = locale || '';
  }

  /**s
   * Returns the pageName
   *
   * @returns {String} pageName
   */
  getPageName() {
    return this.pageName;
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
   * Updates the locale
   *
   * @param {String} locale
   */
  setLocale(locale) {
    this.locale = locale;
    return this;
  }

  /**
   * Creates a a copy of this PagePartial
   *
   * @returns {PagePartial}
   */
  clone () {
    return new PagePartial({
      locale: this.locale,
      path: this.path,
      fileContents: this.fileContents,
      pageName: this.pageName
    });
  }

  /**
   * Creates a @type {PagePartial} from a given filename and path
   *
   * @param {String} filename
   * @param {String} path
   * @param {String} fileContents
   * @returns {PagePartial}
   */
  static from (filename, path, fileContents) {
    if (!filename) {
      throw new SystemError('Error: no filename provided for page partial');
    }

    return new PagePartial({
      path: path,
      fileContents: fileContents,
      pageName: getPageName(filename),
      locale: PagePartial.parseLocale(filename)
    });
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {String} filename the file name of the page handlebars partial
   * @returns {String}
   */
  static parseLocale (filename) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }
}
