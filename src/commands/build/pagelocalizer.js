const LocalizationConfig = require("../../models/localizationconfig");
const Page = require("../../models/page");
const PageConfig = require("../../models/pageconfig");
const PageConfigLocalizer = require("./pageconfiglocalizer");
const PageTemplate = require("../../models/pagetemplate");
const TemplateLocalizer = require("./templatelocalizer");

/**
 * PageLocalizer is responsible for matching PageConfigs and PageTemplates and returning
 * a group of Pages.
 */
module.exports = class PageLocalizer {
  constructor({ defaultLocale, localizationConfig }) {
    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;

    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   */
  generateLocalizedPages(pageConfigs, pageTemplates) {
    const localizedPageConfigs = new PageConfigLocalizer({
      localizationConfig: this._localizationConfig,
      defaultLocale: this._defaultLocale
    }).createLocalizedPageConfigs(pageConfigs);

    const localizedPageTemplates = new TemplateLocalizer({
      localizationConfig: this._localizationConfig,
      defaultLocale: this._defaultLocale
    }).createLocalizedPageTemplates(pageTemplates);

    return this._buildPages({
      pageConfigs: localizedPageConfigs,
      pageTemplates: localizedPageTemplates
    });
  }

  /**
   * Matches @type {Array<PageConfig>} and @type {Array<PageTemplate>}
   * to create a group of @type {Page}s
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   *
   * @returns {Array<Page>}
   */
  _buildPages ({ pageConfigs, pageTemplates }) {
    if (!pageConfigs || !pageTemplates) {
      throw new Error(`Warning: Missing all pageConfigs or pageTemplates, can't generate Pages`);
    }

    let pages = [];
    for (const config of pageConfigs) {
      const pageTemplate = pageTemplates.find(template => {
        return template.getPageName() === config.getPageName() && template.getLocale() === config.getLocale()
      });

      if (!pageTemplate) {
        console.log(`Warning: No page '${config.getPageName()}' found for given locale '${config.getLocale()}', not generating a '${config.getPageName()}' page for '${config.getLocale()}'`);
        continue;
      }

      pages.push(new Page({
        config: config,
        pageTemplate: pageTemplate,
        urlFormatter: this._localizationConfig.getUrlFormatter(config.getLocale()),
      }));
    }

    return pages;
  }
}