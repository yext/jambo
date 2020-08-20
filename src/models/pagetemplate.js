const { getPageName } = require('../utils/fileutils');
const SystemError = require('../errors/systemerror');

/**
 * PageTemplate represents a Handlebars template that is used to
 * generate a page.
 */
module.exports = class PageTemplate {
  constructor({ path, fileContents, pageName, locale }) {
    /**
     * @type {String}
     */
    this.path = path;

    /**
     * @type {String}
     */
    this.fileContents = fileContents;

    /**
     * @type {String}
     */
    this.pageName = pageName;

    /**
     * @type {String}
     */
    this.locale = locale || '';
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
   * Returns the fileContents
   *
   * @returns {String} fileContents
   */
  getContents() {
    return this.fileContents;
  }

  /**
   * Returns the path to the template
   *
   * @returns {String} path
   */
  getPath() {
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
   * Updates the locale
   *
   * @param {String} locale
   */
  setLocale(locale) {
    this.locale = locale;
    return this;
  }

  /**
   * Creates a a copy of this PageTemplate
   *
   * @returns {PageTemplate}
   */
  clone () {
    return new PageTemplate({
      locale: this.locale,
      path: this.path,
      fileContents: this.fileContents,
      pageName: this.pageName
    });
  }

  /**
   * Creates a @type {PageTemplate} from a given filename and path
   *
   * @param {String} filename
   * @param {String} path
   * @param {String} fileContents
   * @returns {PageTemplate}
   */
  static from (filename, path, fileContents) {
    if (!filename) {
      throw new SystemError('Error: no filename provided for page template');
    }

    return new PageTemplate({
      path: path,
      fileContents: fileContents,
      pageName: getPageName(filename),
      locale: PageTemplate.parseLocale(filename)
    });
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {String} filename the file name of the page handlebars template
   * @returns {String}
   */
  static parseLocale (filename) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }
}
