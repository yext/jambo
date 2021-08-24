const LocalizationConfig = require('../../models/localizationconfig');
const Page = require('../../models/page');
const PageConfig = require('../../models/pageconfig');
const PageConfigDecorator = require('./pageconfigdecorator');
const PageSet = require('../../models/pageset');
const PageTemplate = require('../../models/pagetemplate');
const PageTemplateDirector = require('./pagetemplatedirector');
const { NO_LOCALE } = require('../../constants');
const { warn } = require('../../utils/logger');

/**
 * PageSetsBuilder is responsible for matching {@link PageConfigs} and
 * {@link PageTemplates} for each given locale and returning a group
 * of {@link PageSet}s.
 */
module.exports = class PageSetsBuilder {
  constructor({ globalConfig, localizationConfig }) {
    /**
     * @type {GlobalConfig}
     */
    this._globalConfig = globalConfig;

    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Returns a group of PageSet ({@link PageSet}) for the given
   * pageConfigs and pageTemplates, one PageSet per locale.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   * @returns {Array<PageSet>}
   */
  build(pageConfigs, pageTemplates) {
    const localeToPageConfigs = new PageConfigDecorator(this._localizationConfig)
      .decorate(pageConfigs);

    const localeToPageTemplates = new PageTemplateDirector(this._localizationConfig)
      .direct(pageTemplates);

    const pageSets = [];
    for (const [locale, pageConfigs] of Object.entries(localeToPageConfigs)) {
      const templates = localeToPageTemplates[locale];
      if (!templates || templates.length < 1) {
        const localeMessage = locale !== NO_LOCALE
          ? ` for '${locale}' locale`
          : '';
        warn(
          `No page templates found${localeMessage}, not generating a ` +
          `page set${localeMessage}`);
        continue;
      }

      pageSets.push(new PageSet({
        locale: locale,
        pages: this._buildPages(pageConfigs, templates),
        globalConfig: this._globalConfig,
        currentLocaleConfig: this._localizationConfig.getConfigForLocale(locale)
      }));
    }
    return pageSets;
  }

  /**
   * Matches PageConfigs and PageTemplates and returns a collection of Pages.
   *
   * @param {Array<PageConfig>} pageConfigs
   * @param {Array<PageTemplate>} pageTemplates
   * @returns {Array<Page>}
   */
  _buildPages(pageConfigs, pageTemplates) {
    let pages = [];
    for (const config of pageConfigs) {
      const pageTemplate = pageTemplates
        .find(template => template.getPageName() === config.getPageName());

      if (!pageTemplate) {
        const localeMessage = config.getLocale() !== NO_LOCALE
          ? ` found for '${config.getLocale()}' locale`
          : '';
        warn(
          `No page template '${config.getPageName()}'${localeMessage}, ` +
          `not generating a '${config.getPageName()}' page${localeMessage}`);
        continue;
      }

      pages.push(Page.from({
        pageConfig: config,
        pageTemplate: pageTemplate,
        urlFormatter: this._localizationConfig.getUrlFormatter(config.getLocale()),
      }));
    }
    return pages;
  }
}