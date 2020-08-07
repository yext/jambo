const Page = require("../../models/page");
const PageConfig = require("../../models/pageconfig");
const PageSet = require("../../models/pageset");
const PageTemplate = require("../../models/pagetemplate");

/**
 * PageSetCreator is responsible for creating a PageSet from the given information.
 *
 * This class assumes all data has already been localized, its responsibility is putting
 * the data into a @type {PageSet} object.
 */
module.exports = class PageSetCreator {
  constructor({ locale, params, globalConfig }) {
    /**
     * @type {String}
     */
    this.locale = locale;

    /**
     * @type {Object}
     */
    this.params = params;

    /**
     * @type {Object}
     */

    this.globalConfig = globalConfig;
  }

  /**
   * Creates a PageSet
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   * @param {Function} urlFormatter
   *
   * @returns {PageSet}
   */
  create ({ pageConfigs, pageTemplates, urlFormatter }) {
    if (!pageConfigs) {
      console.log(`Warning: Missing configs for locale '${this.locale}', can't build pages`);
      return [];
    }

    if (!pageTemplates) {
      console.log(`Warning: Missing page templates for locale '${this.locale}', can't build pages`);
      return [];
    }

    let pages = [];
    for (const config of pageConfigs) {
      const pageTemplate = pageTemplates.find(template => {
        return template.getPageName() === config.getPageName() && template.getLocale() === config.getLocale()
      });

      if (!pageTemplate) {
        console.log(`Warning: No page '${config.getPageName()}' found for given locale '${this.locale}', not generating a '${config.getPageName()}' page for '${this.locale}'`);
        continue;
      }

      pages.push(new Page({
        config: config,
        pageTemplate: pageTemplate,
        urlFormatter: urlFormatter,
      }));
    }

    return new PageSet({
      pages: pages,
      params: this.params,
      globalConfig: this.globalConfig
    });;
  }
}