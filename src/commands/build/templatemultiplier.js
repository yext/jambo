const PageTemplate = require("../../models/pagetemplate");
const LocalizationConfig = require("../../models/localizationconfig");

/**
 * TemplateMultiplier creates a new, localized @type {PageTemplate}
 * per (pageTemplate, locale) combination.
 */
module.exports = class TemplateMultiplier {
  constructor({ localizationConfig, defaultLocale }) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {Array<String>}
     */
    this._locales = localizationConfig.getLocales().length > 0
      ? localizationConfig.getLocales()
      : [ defaultLocale ];

    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;
  }

  /**
   * Creates a localized PageTemplate for every (page, locale) combination. Considers
   * locale fallbacks, so more PageTemplates may be returned than were provided.
   * It returns one PageTemplate per (page, locale) combination.
   *
   * @param {Array<PageTemplates>} pageTemplates
   * @returns {Array<PageTemplates>}
   */
  multiply(pageTemplates) {
    const pageNameToTemplates = this._getPageNameToTemplates(pageTemplates);

    let localizedPageTemplates = {};
    for (const locale of this._locales) {
      localizedPageTemplates[locale] = [];
      for (const [pageName, templates] of Object.entries(pageNameToTemplates)) {
        const pageTemplateForLocale = this._getPageTemplate(locale, templates);

        if (pageTemplateForLocale) {
          localizedPageTemplates[locale].push(pageTemplateForLocale);
        }
      }
    }
    return localizedPageTemplates;
  }


  /**
   * Builds a new PageTemplate for a given pageTemplate and locale based on the given
   * locale and the fallbacks for that locale.
   *
   * @param {String} locale
   * @param {Array<PageTemplate>} templates
   * @returns {PageTemplate}
   */
  _getPageTemplate(locale, templates) {
    let pageTemplate = templates.find(pageTemplate => this._isLocaleMatch(pageTemplate.getLocale(), locale));
    if (pageTemplate) {
      return new PageTemplate({
        pageName: pageTemplate.getPageName(),
        path: pageTemplate.getTemplatePath(),
        locale: locale,
      });
    }

    for (const fallback of this._localizationConfig.getFallbacks(locale)) {
      pageTemplate = templates.find(page => this._isLocaleMatch(page.getLocale(), fallback));

      if (pageTemplate) {
        return new PageTemplate({
          pageName: pageTemplate.getPageName(),
          path: pageTemplate.getTemplatePath(),
          locale: locale,
        });
      }
    }
  }

  /**
   * Builds an Object mapping pageName to PageTemplates with for the corresponding page.
   *
   * @param {Array<PageTemplate>} templates
   * @returns {Object<String, Array<PageTemplate>>}
   */
  _getPageNameToTemplates(templates) {
    if (!templates || templates.length < 1) {
      return {};
    }

    let pageNameToTemplates = {};
    for (const pageTemplate of templates) {
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
   * @param {Array<PageTemplates>} templates
   * @returns {Array<String>}
   */
  _getUniquePageNames(templates) {
    let pageNames = templates
      ? templates.map((template) => template.getPageName())
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
    return locale === this._defaultLocale || !locale;
  }
}