import GlobalConfig from './globalconfig';
import LocalizationConfig from './localizationconfig';
import Page from './page';

/**
 * PageSet represents a unit that Jambo uses to generate a set of pages.
 * The pages in a PageSet go together and have shared data - such as
 * the globalConfig, pageNameToConfig, and params.
 */
export default class PageSet {
  locale: string
  pages: Page[]
  globalConfig: GlobalConfig
  pageNameToConfig: Record<string, any>
  currentLocaleConfig: LocalizationConfig

  /**
   * @param {String} locale
   * @param {Array<Page>} pages
   * @param {GlobalConfig} globalConfig
   * @param {Object} currentLocaleConfig
   */
  constructor({ locale, pages, globalConfig, currentLocaleConfig }: any) {
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
     * The chunk of the locale config pertaining the this PageSet's locale
     *
     * @type {Object}
     */
    this.currentLocaleConfig = currentLocaleConfig || {};
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
   * Returns the localization config chunk for the current locale
   *
   * @returns {Object}
   */
  getCurrentLocaleConfig() {
    return this.currentLocaleConfig;
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
