const { Page } = require("../../models/page");
const { PageTemplate } = require("../../models/pagetemplate");
const { PageConfig } = require("../../models/pageconfig");

exports.PageBuilder = class {
  constructor({ pageConfigs, pageTemplates, locale, localeFallbacks, urlFormatter }) {
    /**
     * @type {Array<PageConfig>}
     */
    this.pageConfigs = pageConfigs;

    /**
     * @type {Array<PageTemplate>}
     */

    this.pageTemplates = pageTemplates;

    /**
     * @type {String}
     */
    this.locale = locale;

    /**
     * @type {Array<String>}
     */
    this.localeFallbacks = localeFallbacks || [];

    /**
     * @type {Function}
     */
    this.urlFormatter = urlFormatter;
  }

  /**
   * Builds a set of Pages for the given locale
   *
   * @returns {Array<Page>}
   */
  build () {
    if (!this.pageConfigs) {
      console.warn(`Warning: Missing configs for locale '${this.locale}', can't build pageset`);
      return [];
    }

    let pageTemplatesForLocale = this._filterPageTemplatesForLocale(
      this.pageTemplates,
      this.locale,
      this.localeFallbacks
    );
    return this._buildPages(pageTemplatesForLocale, this.pageConfigs);
  }

  /**
   * Returns a set of PageTemplates that should be used for the given locale.
   *
   * @param {Array<PageTemplate>} pageTemplates the pageTemplates
   * @param {String} locale the current locale
   * @param {Array} localeFallbacks the fallbacks for the locale
   * @returns {Array<PageTemplate>}
   */
  _filterPageTemplatesForLocale (pageTemplates, locale, localeFallbacks = []) {
    let pageTemplatesForLocale = [];

    for (const pageName of this._getUniquePageNames(pageTemplates)) {
      const pagesWithPageName = pageTemplates.filter(page => page.getPageName() === pageName);
      let pageForLocale = pagesWithPageName.find((page) => page.getLocale() === locale);

      if (pageForLocale) {
        pageTemplatesForLocale.push(pageForLocale);
        continue;
      }

      for (const fallback of localeFallbacks) {
        pageForLocale = pagesWithPageName.find((page) => page.getLocale() === fallback);
        if (pageForLocale) {
          pageTemplatesForLocale.push(pageForLocale);
          break;
        }
      }
    }

    return pageTemplatesForLocale;
  }

  /**
   * Returns a collection of the unique pageNames from the given pageTemplates
   *
   * @param {Array<PageTemplates>} pageTemplates
   * @returns {Array<String>}
   */
  _getUniquePageNames (pageTemplates) {
    let pageNames = pageTemplates
      ? pageTemplates.map((template) => template.getPageName())
      : [];

    let uniqueNames = [];
    for (const pageName of pageNames) {
      if (uniqueNames.indexOf(pageName) === -1) {
        uniqueNames.push(pageName);
      }
    }
    return uniqueNames;
  }

  /**
   * Returns the pages
   *
   * @param {Array<PageTemplate>} pageTemplates
   * @param {Array<PageConfig>} pageConfigs
   */
  _buildPages(pageTemplates, pageConfigs) {
    let pages = [];
    for (const pageConfig of Object.entries(pageConfigs)) {
      const pageTemplate = pageTemplates
        .find(template => template.getPageName() === pageConfig.getPageName());

      if (!pageTemplate) {
        console.warn(`
          Warning: No page '${pageConfig.getPageName()}' found for given locale '${this.locale}',
          not generating a '${pageConfig.getPageName()}' page for '${this.locale}'`
        );
        continue;
      }

      pages.push(new Page({
        config: pageConfig,
        pageTemplate: pageTemplate,
        urlFormatter: this.urlFormatter,
      }));
    }
    return pages;
  }
}