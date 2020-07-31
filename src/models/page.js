const { stripExtension } = require('../utils/fileutils');

exports.Page = class {
  constructor({ pageId, config, templatePath, urlFormatter }) {
    this.pageId = pageId;
    this.config = config;
    this.templatePath = templatePath;
    this.outputPath = this._buildUrl(pageId, templatePath, urlFormatter);
  }

  getPageId () {
    return this.pageId;
  }

  getConfig () {
    return this.config;
  }

  getTemplatePath () {
    return this.path;
  }

  getOutputPath () {
    return this.outputPath;
  }

  /**
   * Returns the URL for a given pageId, path and formatting function
   *
   * @param {string} pageId
   * @param {string} path
   * @param {string} urlFormatter
   * @returns {string}
   */
  _buildUrl (pageId, path, urlFormatter) {
    const pathWithoutHbsExtension = stripExtension(path);
    const pageExt = pathWithoutHbsExtension
      .substring(pathWithoutHbsExtension.lastIndexOf('.') + 1);
    return urlFormatter(pageId, pageExt);
  }
}
