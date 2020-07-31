const { Page } = require("./page");

exports.PageSet = class {
  constructor({ urlFormatter, pageIdToPath, pageIdToConfig }) {
    this.urlFormatter = urlFormatter;
    this.pages = this._buildPages(pageIdToPath, pageIdToConfig);
  }

  /**s
   * Returns the locale
   *
   * @param {Object} pageIdToPath
   * @param {Object} pageIdToConfig
   */
  _buildPages(pageIdToPath, pageIdToConfig) {
    let pages = [];
    for (const [pageId, pageConfig] of Object.keys(pageIdToConfig)) {
      const pagePath = pageIdToPath[pageId];

      if (!pagePath) {
        console.warn(`No page found for config '${pageId}'`);// TODO  this happens when there are configs in the config dir that don't have pages.
        continue;
      }

      pages.push(new Page({
        pageId: pageId,
        config: pageConfig,
        templatePath: pagePath,
        urlFormatter: urlFormatter,
      }));
    }
    return pages;
  }

  /**
   * Returns the pages
   *
   * @returns {Array<Page>} pages
   */
  getPages () {
    return this.pages;
  }
}