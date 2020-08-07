const { stripExtension } = require('../utils/fileutils');
const { PageConfig } = require('./pageconfig');
const { PageTemplate } = require('./pagetemplate');

exports.Page = class {
  constructor({ config, pageTemplate, urlFormatter }) {
    /**
     * @type {PageConfig}
     */
    this.pageConfig = config;

    /**
     * @type {PageTemplate}
     */
    this.pageTemplate = pageTemplate;

    /**
     * @type {String}
     */
    this.outputPath = this._buildUrl(config.getPageName(), pageTemplate.getTemplatePath(), urlFormatter);
  }

  /**
   * Returns the page name
   *
   * @returns {String}
   */
  getPageName () {
    return this.pageConfig.getPageName();
  }

  /**
   * Returns the page's raw config
   *
   * @returns {Object}
   */
  getConfig () {
    return this.pageConfig.getConfig();
  }

  /**
   * Returns the page's template path
   *
   * @returns {String}
   */
  getTemplatePath () {
    return this.pageTemplate.getTemplatePath();
  }

  /**
   * Returns the page's output path
   *
   * @returns {String}
   */
  getOutputPath () {
    return this.outputPath;
  }

  /**
   * Returns the URL for a given pageName, path and formatting function
   *
   * @param {string} pageName
   * @param {string} path
   * @param {string} urlFormatter
   * @returns {string}
   */
  _buildUrl (pageName, path, urlFormatter) {
    const pathWithoutHbsExtension = stripExtension(path);
    const pageExt = pathWithoutHbsExtension
      .substring(pathWithoutHbsExtension.lastIndexOf('.') + 1);
    return urlFormatter(pageName, pageExt);
  }
}
