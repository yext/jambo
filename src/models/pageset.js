const GlobalConfig = require('./globalconfig');
const Page = require('./page');
const PageConfig = require('./pageconfig');

/**
 * PageSet represents a unit that Jambo uses to generate a set of pages.
 * The pages in a PageSet go together and have shared data - such as
 * the globalConfig, pageNameToConfig, and params.
 */
module.exports = class PageSet {
  /**
   * @param {String} locale
   * @param {Array<Page>} pages
   * @param {GlobalConfig} globalConfig
   * @param {Object} params
   */
  constructor({ locale, pages, globalConfig, params }) {
    /**
     * @type {String}
     */
    this.locale = locale;

    /**
     * @type {Array<Page>}
     */
    this.pages = pages || [];

    /**
     * @type {GlobalConfig}
     */
    this.globalConfig = globalConfig;

    /**
     * @type {Object<String, Object>}
     */
    this.pageNameToConfig = pages && pages.length > 0
      ? this.pages.reduce((obj, page) => {
          obj[page.getPageName()] = page.getConfig();
          return obj;
        }, {})
      : {};

    /**
     * @type {Object}
     */
    this.params = params || {};
  }

  /**
   * Returns the locale
   *
   * @returns {String} locale
   */
  getLocale () {
    return this.locale;
  }

  /**
   * Returns the pages
   *
   * @returns {Array<Page>} pages
   */
  getPages () {
    return this.pages;
  }

  /**
   * Returns the params
   *
   * @returns {Object} params
   */
  getParams () {
    return this.params;
  }

  /**
   * Returns the globalConfig
   *
   * @returns {GlobalConfig} globalConfig
   */
  getGlobalConfig () {
    return this.globalConfig;
  }

  /**
   * Returns the pageNameToConfig
   *
   * @returns {Object<String, PageConfig>}
   */
  getPageNameToConfig () {
    return this.pageNameToConfig;
  }
}
