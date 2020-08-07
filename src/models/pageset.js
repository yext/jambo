const Page = require("./page");

module.exports = class PageSet {
  constructor({ pages, globalConfig, params }) {
    /**
     * @type {Array<Page>}
     */
    this.pages = pages;

    /**
     * @type {Object}
     */
    this.globalConfig = globalConfig;

    /**
     * @type {Object}
     */
    this.pageNameToConfig = this._buildPageNameToConfig(pages);

    /**
     * @type {Object}
     */
    this.params = params;
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
   * @returns {Object} globalConfig
   */
  getGlobalConfig () {
    return this.globalConfig;
  }

  /**
   * Returns the pageNameToConfig
   *
   * @returns {Object} pageNameToConfig
   */
  getPageNameToConfig () {
    return this.pageNameToConfig;
  }

  /**
   * Returns the pageNameToConfig from the given pages
   *
   * @param {Array<Page>} pages
   * @returns {Object} pageNameToConfig
   */
  _buildPageNameToConfig(pages) {
    const pageNameToConfig = {};
    for (const page of pages) {
      pageNameToConfig[page.getPageName()] = page.getConfig();
    }
    return pageNameToConfig;
  }
}
