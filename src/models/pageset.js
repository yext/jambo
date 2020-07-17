const { Page } = require("./page");
const { PageConfig } = require("./pageconfig");

exports.PageSet = class {
  constructor({ pages, pageConfigs, globalConfig, params }) {
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
    this.pageNameToConfig = this._buildPageNameToConfig(pageConfigs);

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
   * Returns the pageNameToConfig from the given pageConfigs
   *
   * @param {Array<PageConfig>} pageConfigs
   * @returns {Object} pageNameToConfig
   */
  _buildPageNameToConfig(pageConfigs) {
    const pageNameToConfig = {};
    for (const config of pageConfigs) {
      pageNameToConfig[config.getPageName()] = config.getConfig();
    }
    return pageNameToConfig;
  }
}
