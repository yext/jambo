import { stripExtension } from '../utils/fileutils';
import { canonicalizeLocale } from '../utils/i18nutils';
import { NO_LOCALE } from '../constants';

/**
 * PageTemplate represents a Handlebars template that is used to
 * generate a page.
 */
export default class PageTemplate {
  path: string;
  fileContents: string;
  pageName: string;
  locale: string;

  constructor({ path, fileContents, pageName, locale }: any) {
    /**
     * @type {String}
     */
    this.path = path;

    /**
     * @type {String}
     */
    this.fileContents = fileContents;

    /**
     * @type {String}
     */
    this.pageName = pageName;

    /**
     * @type {String}
     */
    this.locale = locale || NO_LOCALE;
  }

  /**
   * Returns the pageName
   *
   * @returns {String} pageName
   */
  getPageName() {
    return this.pageName;
  }

  /**
   * Returns the fileContents
   *
   * @returns {String} fileContents
   */
  getContents() {
    return this.fileContents;
  }

  /**
   * Returns the path to the template
   *
   * @returns {String} path
   */
  getPath() {
    return this.path;
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
   * Updates the locale
   *
   * @param {String} locale
   */
  setLocale(locale: string) {
    this.locale = locale;
    return this;
  }

  /**
   * Creates a a copy of this PageTemplate
   *
   * @returns {PageTemplate}
   */
  clone() {
    return new PageTemplate({
      locale: this.locale,
      path: this.path,
      fileContents: this.fileContents,
      pageName: this.pageName
    });
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {String} filename the file name of the page handlebars template
   * @returns {String}
   */
  static parseLocale(filename: string) {
    const pageParts = stripExtension(stripExtension(filename)).split('.');
    const locale = pageParts.length > 1 && pageParts[1];
    return canonicalizeLocale(locale);
  }
}
