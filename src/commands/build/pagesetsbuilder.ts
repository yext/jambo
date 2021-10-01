import LocalizationConfig from '../../models/localizationconfig';
import Page from '../../models/page';
import PageConfig from '../../models/pageconfig';
import PageConfigDecorator from './pageconfigdecorator';
import PageSet from '../../models/pageset';
import PageTemplate from '../../models/pagetemplate';
import PageTemplateDirector from './pagetemplatedirector';
import { NO_LOCALE } from '../../constants';
import { warn } from '../../utils/logger';
import GlobalConfig from '../../models/globalconfig';

/**
 * PageSetsBuilder is responsible for matching {@link PageConfigs} and
 * {@link PageTemplates} for each given locale and returning a group
 * of {@link PageSet}s.
 */
export default class PageSetsBuilder {
  private _globalConfig: GlobalConfig;
  private _localizationConfig: LocalizationConfig;

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
  build(pageConfigs: Array<PageConfig>, pageTemplates: Array<PageTemplate>) {
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
  _buildPages(pageConfigs: Array<PageConfig>, pageTemplates: Array<PageTemplate>) {
    const pages = [];
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