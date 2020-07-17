/**
 * PageConfig
 */
exports.PageConfig = class {
  constructor({ pageName, locale, rawConfig }) {
    this.rawConfig = rawConfig;
    this.pageName = pageName;
    this.locale = locale || ''; // TODO do we want this fallback
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