const { PageTemplate } = require("../../models/pagetemplate");
const { LocalizationConfig } = require("../../models/localizationconfig");

/**
 * Merges the relevant page configurations based on locale
 */
exports.TemplateLocalizer = class {
  constructor({ localizationConfig, defaultLocale }) {
    /**
     * @type {LocalizationConfig}
     */
    this.localizationConfig = localizationConfig;

    /**
     * @type {String}
     */
    this.defaultLocale = defaultLocale;
  }

  /**
   * Creates a localized PageConfig for every page and locale, merging the rawConfigs
   * based on the fallbacks and locale configuration in this.localizationConfig.
   *
   * @param {Array<PageTemplates>} pageTemplates
   * @returns {Array<PageTemplates>}
   */
  createLocalizedPageTemplates(pageTemplates) {
    const pageNameToTemplates = this._getPageNameToTemplates(pageTemplates);

    let localizedPageConfigs = [];
    for (const locale of this.localizationConfig.getLocales()) {
      for (const [pageName, templates] of Object.entries(pageNameToTemplates)) {
        const pageTemplateForLocale = this._getPageTemplate(locale, templates);

        if (pageTemplateForLocale) {
          localizedPageConfigs.push(pageTemplateForLocale);
        }
      }
    }
    return localizedPageConfigs;
  }


  /**
   * Builds a new PageConfig for the given pageName and locale with a merged config
   * based on the locale and fallbacks.
   *
   * @param {String} pageName
   * @param {String} locale
   * @param {Array<PageConfig>} configs
   * @returns {PageConfig}
   */
  _getPageTemplate(locale, templates) {
    let pageTemplate = templates.find(pageTemplate => this._isLocaleMatch(pageTemplate.getLocale(), locale));

    if (pageTemplate) {
      return PageTemplate.from(pageTemplate, locale);
    }

    for (const fallback of this.localizationConfig.getFallbacks(locale)) {
      pageTemplate = templates.find(page => this._isLocaleMatch(page.getLocale(), fallback));

      if (pageTemplate) {
        return PageTemplate.from(pageTemplate, locale);
      }
    }
  }

  /**
   * Builds an Object mapping page name to PageConfigs with for the corresponding page.
   *
   * @param {Array<PageConfig>} configs
   * @returns {Object}
   */
  _getPageNameToTemplates(pageTemplates) {
    if (!pageTemplates || pageTemplates.length < 1) {
      return {};
    }

    let pageNameToTemplates = {};
    for (const pageTemplate of pageTemplates) {
      const pageName = pageTemplate.getPageName();
      if (!pageNameToTemplates[pageName]) {
        pageNameToTemplates[pageName] = [];
      }
      pageNameToTemplates[pageName].push(pageTemplate);
    }
    return pageNameToTemplates;
  }

  /**
   * Returns a collection of the unique pageNames from the given pageTemplates
   *
   * @param {Array<PageTemplates>} pageTemplates
   * @returns {Array<String>}
   */
  _getUniquePageNames(pageTemplates) {
    let pageNames = pageTemplates
      ? pageTemplates.map((template) => template.getPageName())
      : [];

    let uniqueNames = [];
    for (const pageName of pageNames) {
      if (uniqueNames.indexOf(pageName) === -1) {
        uniqueNames.push(pageName);
      }
    }
    return uniqueNames;
  }

  /**
   * Determines whether the given locales match
   *
   * @param {String} locale
   * @returns {boolean}
   */
  _isLocaleMatch(locale1, locale2) {
    return locale1 === locale2 ||
      (this._isDefaultLocale(locale1) && (this._isDefaultLocale(locale2)));
  }

  /**
   * Determines whether the given locale is the default locale
   *
   * @param {String} locale
   * @returns {boolean}
   */
  _isDefaultLocale(locale) {
    return locale === this.defaultLocale || !locale;
  }
}