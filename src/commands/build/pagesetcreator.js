const { PageSet } = require("../../models/pageset");
const { PageTemplate } = require("../../models/pagetemplate");
const { VerticalConfigs } = require("../../models/verticalconfigs");

exports.PageSetCreator = class {
  constructor({ pageIdToConfig, urlFormatter }) {
    this.pageIdToConfig = pageIdToConfig;
    this.urlFormatter = urlFormatter;
  }
  /**
   * Returns a pageSet for the given locale
   *
   * @param {Array<PageTemplate>} pageTemplates the pageTemplates
   * @param {string} locale the current locale
   * @param {Array} localeFallbacks the fallbacks for the locale
   * @param {Object} pageIdToConfig the configs for the pages
   * @returns {PageSet}
   */
  buildPageSetForLocale ({ pageTemplates, locale, localeFallbacks = []}) {
    let pageIdToPath = this.getPageIdToPath(pageTemplates, locale, localeFallbacks);
    return new PageSet({
      pageIdToPath: pageIdToPath,
      pageIdToConfig: this.pageIdToConfig,
      urlFormatter: this.urlFormatter
    });
  }

  /**
   * Returns a map of pageId to pageTemplatePath, where the pageTemplatePath is the path
   * to the page template that should be used for the given locale.
   *
   * @param {Array<PageTemplate>} pageTemplates the pageTemplates
   * @param {string} locale the current locale
   * @param {Array} localeFallbacks the fallbacks for the locale
   * @returns {Object}
   */
  getPageIdToPath (pageTemplates, locale, localeFallbacks = []) {
    const pageIds = this._getUniquePageIds(pageTemplates);
    let pageIdToTemplatePath = {};

    for (const pageId of pageIds) {
      const pagesPerLocale = pageTemplates.filter(page => page.getPageId() === pageId);
      let page = pagesPerLocale.find((page) => page.getLocale() === locale);

      if (!page) {
        for (const fallback of localeFallbacks) {
          page = pagesPerLocale.find((page) => page.getLocale() === fallback);
          if (page) {
            break;
          }
        }
      }

      page = page || pageTemplates.find(page => !page.getLocale());

      if (!page) {
        throw new Error(`ERROR: No page '${pageId}' found for given locale '${locale}'`);
      }

      pageIdToTemplatePath[page.getPageId()] = page.getTemplatePath();
    }

    return pageIdToTemplatePath;
  }

  /**
   * Returns a collection of the unique pageIds from the given pageTemplates
   *
   * @param {Array<PageTemplate>} pageTemplates
   * @returns {Array<string>}
   */
  _getUniquePageIds (pageTemplates) {
    let uniquePageIds = [];

    for (let pageTemplate of pageTemplates) {
      if (!uniquePageIds.includes(pageTemplate.getPageId())) {
        uniquePageIds.push(pageTemplate.getPageId());
      }
    }
    return uniquePageIds;
  }
}