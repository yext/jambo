const GlobalConfigLocalizer = require('./globalconfiglocalizer');
const LocalizationConfig = require('../../models/localizationconfig');
const Page = require('../../models/page');
const PageConfig = require('../../models/pageconfig');
const PageConfigDecorator = require('./pageconfigdecorator');
const PageSet = require('../../models/pageset');
const PageTemplate = require('../../models/pagetemplate');
const TemplateDirector = require('./templatedirector');

/**
 * PageSetsBuilder is responsible for matching {@link PageConfigs} and
 * {@link PageTemplates} for each given locale and returning a group
 * of {@link PageSet}s.
 */
module.exports = class PageSetsBuilder {
  constructor({ defaultLocale, globalConfig, localizationConfig }) {
    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;

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
    const localeToFallbacks = this._localizationConfig
      .getLocales()
      .reduce((obj, locale) => {
        obj[locale] = this._localizationConfig.getFallbacks(locale);
        return obj;
      }, {});

    const localeToPageConfigs = new PageConfigDecorator({
      localeToFallbacks: localeToFallbacks,
      defaultLocale: this._defaultLocale
    }).decorate(pageConfigs);

    const localeToPageTemplates = new TemplateDirector({
      locales: this._localizationConfig.getLocales(),
      localeToFallbacks: localeToFallbacks,
      defaultLocale: this._defaultLocale
    }).direct(pageTemplates);

    const pageSets = [];
    for (const [locale, pageConfigs] of Object.entries(localeToPageConfigs)) {
      const localizedGlobalConfig = new GlobalConfigLocalizer(this._localizationConfig)
        .localize(this._globalConfig, locale);

      pageSets.push(new PageSet({
        locale: locale,
        pages: this._buildPages(pageConfigs, localeToPageTemplates[locale]),
        globalConfig: localizedGlobalConfig,
        params: this._localizationConfig.getParams(locale)
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
  _buildPages (pageConfigs, pageTemplates) {
    let pages = [];
    for (const config of pageConfigs) {
      const pageTemplate = pageTemplates
        .find(template => template.getPageName() === config.getPageName());

      if (!pageTemplate) {
        console.log(`Warning: No page '${config.getPageName()}' found for given locale '${config.getLocale()}', not generating a '${config.getPageName()}' page for '${config.getLocale()}'`);
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