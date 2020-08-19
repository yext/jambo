const PagePartial = require('../../models/pagepartial');

/**
 * PagePartialDirector creates a new, localized {@link PagePartial}
 * per (pagePartial, locale) combination.
 */
module.exports = class PagePartialDirector {
  constructor({ locales, localeToFallbacks, defaultLocale }) {
    /**
     * @type {Array<String>}
     */
    this._locales = locales && locales.length > 0
      ? locales
      : [ defaultLocale ];

    /**
     * @type {Object<String, Array<String>>}
     */
    this._localeToFallbacks = localeToFallbacks;

    /**
     * @type {String}
     */
    this._defaultLocale = defaultLocale;
  }

  /**
   * Creates a localized PagePartial for every (page, locale) combination. Considers
   * locale fallbacks, so more PagePartials may be returned than were provided.
   * It returns one PagePartial per (page, locale) combination.
   *
   * @param {Array<PagePartials>} pagePartials
   * @returns {Array<PagePartials>}
   */
  direct(pagePartials) {
    const pageNameToTemplates = this._getPageNameToTemplates(pagePartials);

    let localizedPagePartials = {};
    for (const locale of this._locales) {
      localizedPagePartials[locale] = [];
      for (const templates of Object.values(pageNameToTemplates)) {
        const pagePartial = this._findPagePartialForLocale(locale, templates);

        if (pagePartial) {
          const localizedTemplate = pagePartial.clone()
            .setLocale(locale);
          localizedPagePartials[locale].push(localizedTemplate);
        }
      }
    }
    return localizedPagePartials;
  }


  /**
   * Finds the PagePartial for the given locale in the provided collection of PagePartials,
   * the match is determined based the locale and the fallbacks.
   *
   * @param {String} locale
   * @param {Array<PagePartial>} templatesForPage
   * @returns {PagePartial}
   */
  _findPagePartialForLocale(locale, templatesForPage) {
    let pagePartial = templatesForPage.find(template => this._isLocaleMatch(template.getLocale(), locale));
    if (pagePartial) {
      return pagePartial;
    }

    const localeFallbacks = this._localeToFallbacks[locale] || [];
    for (const fallback of localeFallbacks) {
      pagePartial = templatesForPage.find(template => this._isLocaleMatch(template.getLocale(), fallback));

      if (pagePartial) {
        return pagePartial;
      }
    }
  }

  /**
   * Builds an Object mapping pageName to PagePartials with for the corresponding page.
   *
   * @param {Array<PagePartial>} templates
   * @returns {Object<String, Array<PagePartial>>}
   */
  _getPageNameToTemplates(templates) {
    if (!templates || templates.length < 1) {
      return {};
    }

    let pageNameToTemplates = {};
    for (const pagePartial of templates) {
      const pageName = pagePartial.getPageName();
      if (!pageNameToTemplates[pageName]) {
        pageNameToTemplates[pageName] = [];
      }
      pageNameToTemplates[pageName].push(pagePartial);
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
    return locale === this._defaultLocale || !locale;
  }
}