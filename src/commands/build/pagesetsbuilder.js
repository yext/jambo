const LocalizationConfig = require("../../models/localizationconfig");
const Page = require("../../models/page");
const PageConfig = require("../../models/pageconfig");
const PageConfigDecorator = require("./pageconfigdecorator");
const PageSet = require("../../models/pageset");
const PageTemplate = require("../../models/pagetemplate");
const TemplateMultiplier = require("./templatemultiplier");

/**
 * PageSetsBuilder is responsible for matching @type {PageConfigs} and
 * @type {PageTemplates} for each given locale and returning a group
 * of @type {PageSet}s.
 */
module.exports = class PageSetsBuilder {
  constructor({ defaultLocale, localeToGlobalConfig, localizationConfig }) {
    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;

    /**
     * @type {Object<String, GlobalConfig>}
     */
    this._localeToGlobalConfig = localeToGlobalConfig;

    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Returns a group of PageSet (@type {PageSet}) for the given
   * pageConfigs and pageTemplates, one PageSet per locale.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   * @returns {Array<PageSet>}
   */
  build(pageConfigs, pageTemplates) {
    const localeToPageConfigs = new PageConfigDecorator({
      localizationConfig: this._localizationConfig,
      defaultLocale: this._defaultLocale
    }).decorate(pageConfigs);

    const localeToPageTemplates = new TemplateMultiplier({
      localizationConfig: this._localizationConfig,
      defaultLocale: this._defaultLocale
    }).multiply(pageTemplates);

    const localeToPages = this._buildLocaleToPages({
      localeToPageConfigs: localeToPageConfigs,
      localeToPageTemplates: localeToPageTemplates
    });

    const pageSets = [];
    for (const [locale, pages] of Object.entries(localeToPages)) {
      pageSets.push(new PageSet({
        locale: locale,
        pages: pages,
        globalConfig: this._localeToGlobalConfig[locale],
        params: this._localizationConfig.getParams(locale)
      }));
    }
    return pageSets;
  }

  /**
   * Matches PageConfigs and PageTemplates and returns a group of Pages, keyed
   * by locale.
   *
   * @param {Object<String, Array<PageConfig>>} localeToPageConfigs
   * @param {Object<String, Array<PageTemplate>>} localeToPageTemplates
   * @returns {Object<String, Array<Page>>}
   */
  _buildLocaleToPages ({ localeToPageConfigs, localeToPageTemplates }) {

    let localeToPages = {};
    for (const [locale, configs] of Object.entries(localeToPageConfigs)) {
      if (!localeToPageTemplates[locale] || !configs) {
        throw new Error(`Warning: Missing pageTemplates for ${locale}, can't generate Pages for ${locale}`);
      }

      localeToPages[locale] = [];
      for (const config of configs) {
        const pageTemplate = localeToPageTemplates[locale]
          .find(template => template.getPageName() === config.getPageName());

        if (!pageTemplate) {
          console.log(`Warning: No page '${config.getPageName()}' found for given locale '${locale}', not generating a '${config.getPageName()}' page for '${locale}'`);
          continue;
        }

        localeToPages[locale].push(new Page({
          config: config,
          pageTemplate: pageTemplate,
          urlFormatter: this._localizationConfig.getUrlFormatter(locale),
        }));
      }
    }

    return localeToPages;
  }
}