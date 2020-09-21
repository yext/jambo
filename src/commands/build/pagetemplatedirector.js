const PageTemplate = require('../../models/pagetemplate');
const LocalizationConfig = require('../../models/localizationconfig');

/**
 * PageTemplateDirector creates a new, localized {@link PageTemplate}
 * per (pageTemplate, locale) combination.
 */
module.exports = class PageTemplateDirector {
  constructor(localizationConfig) {
    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;
  }

  /**
   * Creates a localized PageTemplate for every (page, locale) combination. Considers
   * locale fallbacks, so more PageTemplates may be returned than were provided.
   * It returns one PageTemplate per (page, locale) combination.
   *
   * @param {Array<PageTemplates>} pageTemplates
   * @returns {Array<PageTemplates>}
   */
  direct(pageTemplates) {
    if (!this._localizationConfig.hasConfig()) {
      return {
        [this._localizationConfig.getDefaultLocale()] : pageTemplates
      };
    }

    const pageNameToTemplates = this._getPageNameToTemplates(pageTemplates);

    let localizedPageTemplates = {};
    for (const locale of this._localizationConfig.getLocales()) {
      localizedPageTemplates[locale] = [];
      for (const templates of Object.values(pageNameToTemplates)) {
        const pageTemplate = this._findPageTemplateForLocale(locale, templates);

        if (pageTemplate) {
          const localizedTemplate = pageTemplate.clone()
            .setLocale(locale);
          localizedPageTemplates[locale].push(localizedTemplate);
        }
      }
    }
    return localizedPageTemplates;
  }


  /**
   * Finds the PageTemplate for the given locale in the provided collection of
   * PageTemplates, the match is determined based the locale and the fallbacks.
   *
   * @param {String} locale
   * @param {Array<PageTemplate>} templatesForPage
   * @returns {PageTemplate}
   */
  _findPageTemplateForLocale(locale, templatesForPage) {
    let pageTemplate = templatesForPage
      .find(template => this._isLocaleMatch(template.getLocale(), locale));
    if (pageTemplate) {
      return pageTemplate;
    }

    const localeFallbacks = this._localizationConfig.getFallbacks(locale);
    for (const fallback of localeFallbacks) {
      pageTemplate = templatesForPage
        .find(template => this._isLocaleMatch(template.getLocale(), fallback));

      if (pageTemplate) {
        return pageTemplate;
      }
    }

    return templatesForPage
      .find(template => this._isDefaultLocale(template.getLocale()));
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
    return locale === this._localizationConfig.getDefaultLocale() || !locale;
  }
}