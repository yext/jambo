const { Page } = require("./page");

exports.PageSet = class {
  constructor({ urlFormatter, pageIdToPath, pageIdToConfig }) {
    this.pages = this._buildPages(urlFormatter, pageIdToPath, pageIdToConfig);
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
   * Returns the pages
   *
   * @param {function} urlFormatter
   * @param {Object} pageIdToPath
   * @param {Object} pageIdToConfig
   */
  _buildPages(urlFormatter, pageIdToPath, pageIdToConfig) {
    if (!pageIdToConfig) {
      return [];
    }

    let pages = [];
    for (const [pageId, pageConfig] of Object.entries(pageIdToConfig)) {
      const pagePath = pageIdToPath[pageId];
      if (pagePath) {
        pages.push(new Page({
          pageId: pageId,
          config: pageConfig,
          templatePath: pagePath,
          urlFormatter: urlFormatter,
        }));
      }
    }
    return pages;
  }
}
