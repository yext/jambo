/**
 * PageConfig is a representation of the a PageConfig for a given Page.
 * It contains the configuration for the Page for the given locale.
 */
module.exports = class PageConfig {
  /**
   * @param {String} pageName
   * @param {String} locale
   * @param {Object} rawConfig
   */
  constructor({ pageName, locale, rawConfig }) {
    /**
     * @type {String}
     */
    this.pageName = pageName;

    /**
     * @type {String}
     */
    this.locale = locale || '';

    /**
     * @type {Object}
     */
    this.rawConfig = rawConfig;
  }

  /**
   * Returns the raw config
   *
   * @returns {Object}
   */
  getConfig () {
    return this.rawConfig;
  }

  /**
   * Returns the page name
   *
   * @returns {String}
   */
  getPageName () {
    return this.pageName;
  }

  /**
   * Returns the locale
   *
   * @returns {String}
   */
  getLocale () {
    return this.locale;
  }
}