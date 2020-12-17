const GlobalConfig = require('./globalconfig');
const LocalizationConfig = require('./localizationconfig');
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
   * @param {LocalizationConfig} localizationConfig
   */
  constructor({ locale, pages, globalConfig, localizationConfig }) {
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
          obj[page.getName()] = page.getConfig();
          return obj;
        }, {})
      : {};

    /**
     * @type {LocalizationConfig}
     */
    this.localizationConfig = localizationConfig;
  }

  /**
   * Returns the locale
   *
   * @returns {String} locale
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Returns the pages
   *
   * @returns {Array<Page>} pages
   */
  getPages() {
    return this.pages;
  }

  /**
   * Returns the localization config
   *
   * @returns {LocalizationConfig}
   */
  getLocalizationConfig() {
    return this.localizationConfig;
  }

  /**
   * Returns the globalConfig
   *
   * @returns {GlobalConfig} globalConfigs
   */
  getGlobalConfig() {
    return this.globalConfig;
  }

  /**
   * Returns the pageNameToConfig
   *
   * @returns {Object<String, PageConfig>}
   */
  getPageNameToConfig() {
    return this.pageNameToConfig;
  }
}
