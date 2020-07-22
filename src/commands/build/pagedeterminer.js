/**
 * Determines which pages should be written based on locale information.
 */
exports.PageDeterminer = class {
  /**
   * Returns a map of pageId to pageTemplatePath, where the pageTemplatePath is the path
   * to the page template that should be used for the given locale.
   *
   * @param {Object} pagesDirectory the path to the pages directory
   * @param {string} locale the current locale
   * @returns {Object}
   */
  buildPageIdToPath(pages, locale, localeFallbacks = []) {
    if (!pages) {
      return {};
    }

    const pageIds = this._getUniquePageIds(pages);
    let pageIdToPageTemplatePath = {};

    for (const pageId of pageIds) {
      const pagesPerLocale = pages.filter(page => page.pageId === pageId);
      let indexForPage = pagesPerLocale.findIndex((page) => page.locale === locale);

      if (indexForPage === -1) {
        for (const fallback of localeFallbacks) {
          indexForPage = pagesPerLocale.findIndex((page) => page.locale === fallback);
          if (indexForPage !== -1) {
            break;
          }
        }
      }

      const page = indexForPage !== -1
        ? pages[indexForPage]
        : pages.find(page => page.locale === '');

      if (!page) {
        throw new Error(`ERROR: No page '${pageId}' found for given locale '${locale}'`);
      }

      pageIdToPageTemplatePath[page.pageId] = page.path;
    }

    return pageIdToPageTemplatePath;
  }

  /**
   * Returns a collection of the unique pageIds from the given pages
   *
   * @param {Array} pages
   * @returns {Array}
   */
  _getUniquePageIds (pages) {
    let uniquePageIds = [];
    for (let page of pages) {
      if (!uniquePageIds.includes(page.pageId)) {
        uniquePageIds.push(page.pageId);
      }
    }
    return uniquePageIds;
  }

  /**
   * Extracts the pageId from a given file name
   *
   * @param {string} filename the file name of the page handlebars template
   * @returns {string}
   */
  _getPageId(filename) {
    return filename.split('.')[0];
  }

  /**
   * Extracts the locale from a given file name
   *
   * @param {string} filename the file name of the page handlebars template
   * @returns {string}
   */
  _getLocale(filename) {
    let pageParts = this._stripExtension(this._stripExtension(filename)).split('.');
    return pageParts.length > 1 && pageParts[1];  // TODO seems brittle
  }

  _stripExtension(fn) {
    if (fn.indexOf(".") === -1) {
      return fn;
    }
    return fn.substring(0, fn.lastIndexOf("."));
  }

  _isValidFile(fileName) {
    return fileName && !fileName.startsWith('.');
  }
}