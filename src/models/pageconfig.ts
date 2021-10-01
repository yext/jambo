import { NO_LOCALE } from '../constants';

/**
 * PageConfig is a representation of the configuration for the Page for
 * the given locale.
 */
export default class PageConfig {
  pageName: string;
  locale: string;
  rawConfig: any;

  /**
   * @param {String} pageName
   * @param {String} locale
   * @param {Object} rawConfig
   */
  constructor({ pageName, locale, rawConfig }: any) {
    /**
     * @type {String}
     */
    this.pageName = pageName;

    /**
     * @type {String}
     */
    this.locale = locale || NO_LOCALE;

    /**
     * @type {Object}
     */
    this.rawConfig = rawConfig;
  }

  /**
   * Returns the raw config
   *
   * @returns {Object}
   */
  getConfig() {
    return this.rawConfig;
  }

  /**
   * Returns the page name
   *
   * @returns {String}
   */
  getPageName() {
    return this.pageName;
  }

  /**
   * Returns the locale
   *
   * @returns {String}
   */
  getLocale() {
    return this.locale;
  }
}