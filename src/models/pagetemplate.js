const { getPageName } = require('../utils/fileutils');

/**
 * PageTemplate represents a Handlebars template file that is
 * used to generate a page.
 */
module.exports = class PageTemplate {
  constructor({ pageName, path, locale }) {
    /**
     * @type {String}
     */
    this.path = path;

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
   * Creates a @type {PageTemplate} from a given filename and path
   *
   * @param {String} filename
   * @param {String} path
   * @returns {PageTemplate}
   */
  static from (filename, path) {
    if (!filename) {
      throw new Error('Error: no filename provided for page template');
    }

    return new PageTemplate({
      path: path,
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
