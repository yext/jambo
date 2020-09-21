const PageConfig = require('./pageconfig');
const PageTemplate = require('./pagetemplate');
const { stripExtension } = require('../utils/fileutils');

/**
 * Page is a representation of the a Page that Jambo will generate. It contains all of the
 * page-specific information necessary to write an output HTML file for a given page.
 */
module.exports = class Page {
  /**
   * @param {PageConfig} pageConfig
   * @param {String} templateContents
   * @param {String} outputPath
   */
  constructor({ pageConfig, templateContents, outputPath }) {
    /**
     * @type {PageConfig}
     */
    this.pageConfig = pageConfig;

    /**
     * @type {String}
     */
    this.templateContents = templateContents;

    /**
     * @type {String}
     */
    this.outputPath = outputPath;
  }

  /**
   * Sets the page template contents
   *
   * @returns {String}
   */
  setTemplateContents(templateContents) {
    this.templateContents = templateContents;
  }

  /**
   * Returns the locale
   *
   * @returns {String}
   */
  getLocale() {
    return this.pageConfig.getLocale();
  }

  /**
   * Returns the page name
   *
   * @returns {String}
   */
  getName() {
    return this.pageConfig.getPageName();
  }

  /**
   * Returns the page's raw config
   *
   * @returns {Object}
   */
  getConfig() {
    return Object.assign({}, {
        url: this.outputPath,
      },
      this.pageConfig.getConfig(),
    );
  }

  /**
   * Returns the file contents of the page's template
   *
   * @returns {String}
   */
  getTemplateContents() {
    return this.templateContents;
  }

  /**
   * Returns the page's output path
   *
   * @returns {String}
   */
  getOutputPath() {
    return this.outputPath;
  }

  /**
   * @param {PageConfig} pageConfig
   * @param {PageTemplate} pageTemplate
   * @param {Function} urlFormatter
   */
  static from({ pageConfig, pageTemplate, urlFormatter }) {
    const outputPath = Page.buildUrl(
      pageConfig.getPageName(),
      pageTemplate.getPath(),
      urlFormatter
    );

    return new Page({
      pageConfig: pageConfig,
      templateContents: pageTemplate.getContents(),
      outputPath: outputPath
    });
  }

  /**
   * Returns the URL for a given pageName, path and formatting function
   *
   * @param {String} pageName
   * @param {String} path
   * @param {String} urlFormatter
   * @returns {String}
   */
  static buildUrl(pageName, path, urlFormatter) {
    const pathWithoutHbsExtension = stripExtension(path);
    const pageExt = pathWithoutHbsExtension
      .substring(pathWithoutHbsExtension.lastIndexOf('.') + 1);
    return urlFormatter(pageName, pageExt);
  }
}
