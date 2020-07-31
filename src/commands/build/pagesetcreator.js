const { PageSet } = require("../../models/pageset");
const { PageTemplate } = require("../../models/pagetemplate");

exports.PageSetCreator = class {
  /**
   * @param {Object} pageIdToConfig
   * @param {Arrays} pageIds
   * @param {function} urlFormatter
   */
  constructor({ pageIdToConfig, urlFormatter, pageIds, pageTemplates, locale, localeFallbacks = [] }) {
    this.pageIdToConfig = pageIdToConfig;
    this.urlFormatter = urlFormatter;
    this.pageIds = this._getUniquePageIds(pageIds);
    this.pageTemplates = pageTemplates;
    this.locale = locale;
    this.localeFallbacks = localeFallbacks;
  }

  /**
   * Returns a pageSet for the given locale
   *
   * @param {Array<PageTemplate>} pageTemplates the pageTemplates
   * @param {string} locale the current locale
   * @param {Array} localeFallbacks the fallbacks for the locale
   * @returns {PageSet}
   */
  build () {
    if (!this.pageIds || !this.pageIdToConfig) {
      console.warn(`Warning: Missing config for locale '${this.locale}', can't build pageset`);
      return new PageSet({});
    }

    let pageIdToPath = this._getPageIdToPath(
      this.pageIds,
      this.pageTemplates,
      this.locale,
      this.localeFallbacks
    );
    return new PageSet({
      pageIdToPath: pageIdToPath,
      pageIdToConfig: this.pageIdToConfig,
      urlFormatter: this.urlFormatter
    });
  }

  /**
   * Returns a map of pageId to templatePath, where the templatePath is the path
   * to the page template that should be used for the given locale.
   *
   * @param {Array<string>} pageIds the pageIds to find paths for
   * @param {Array<PageTemplate>} pageTemplates the pageTemplates
   * @param {string} locale the current locale
   * @param {Array} localeFallbacks the fallbacks for the locale
   * @returns {Object}
   */
  _getPageIdToPath (pageIds, pageTemplates, locale, localeFallbacks = []) {
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

      if (!page) {
        console.warn(`Warning: No page '${pageId}' found for given locale '${locale}', not generating a '${pageId}' page for '${locale}'`);
        continue;
      }

      pageIdToTemplatePath[page.getPageId()] = page.getTemplatePath();
    }

    return pageIdToTemplatePath;
  }

  /**
   * Returns a collection of the unique pageIds from the given pageIds
   *
   * @param {Array<string>} pageIds
   * @returns {Array<string>}
   */
  _getUniquePageIds (pageIds) {
    return pageIds && pageIds.filter((id, index) => pageIds.indexOf(id) === index);
  }
}