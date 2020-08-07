const { Page } = require("../../models/page");
const { PageTemplate } = require("../../models/pagetemplate");
const { PageConfig } = require("../../models/pageconfig");

exports.PagesBuilder = class {
  constructor({ pageConfigs, pageTemplates, locale, urlFormatter }) {
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
     * @type {Function}
     */
    this.urlFormatter = urlFormatter;
  }

  /**
   * Builds a set of Pages for the given locale
   *
   * @returns {Array<Page>}
   */
  buildPages () {
    if (!this.pageConfigs) {
      console.log(`Warning: Missing configs for locale '${this.locale}', can't build pages`);
      return [];
    }

    if (!this.pageTemplates) {
      console.log(`Warning: Missing page templates for locale '${this.locale}', can't build pages`);
      return [];
    }

    let pages = [];
    for (const config of this.pageConfigs) {
      const pageTemplate = this.pageTemplates.find(template => {
        return template.getPageName() === config.getPageName() && template.getLocale() === config.getLocale()
      });

      if (!pageTemplate) {
        console.log(`Warning: No page '${config.getPageName()}' found for given locale '${this.locale}', not generating a '${config.getPageName()}' page for '${this.locale}'`);
        continue;
      }

      pages.push(new Page({
        config: config,
        pageTemplate: pageTemplate,
        urlFormatter: this.urlFormatter,
      }));
    }
    return pages;
  }
}