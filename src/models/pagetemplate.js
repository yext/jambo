const { getPageName } = require('../utils/fileutils');

/**
 * PageTemplate represents a Handlebars template file that is
 * used to generate a page.
 */
module.exports = class PageTemplate {
  /**
   * @param {String} filename
   * @param {String} path
   */
  constructor({ filename, path }) {
    if (!filename) {
      throw new Error('Error: no filename provided for page template');
    }

    /**
     * @type {String}
     */
    this.path = path;

    /**
     * @type {String}
     */
    this.pageName = getPageName(filename);

    /**
     * @type {String}
     */
    this.locale = this._parseLocale(filename) || '';
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
   * @param {String} filename the file name of the page handlebars template
   * @returns {String}
   */
  _parseLocale (filename) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];
  }

  /**
   * Creates a new PageTemplate object from a given PageTemplate and locale
   *
   * @param {PageTemplate} pageTemplate
   * @param {String} locale
   * @returns {PageTemplate}
   */
  static from (pageTemplate, locale) {
    const page = new PageTemplate({
      filename: 'placeholder',
    });

    page.path = pageTemplate.path;
    page.pageName = pageTemplate.pageName;
    page.locale = locale;
    return page;
  }
}
