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
    const pageNameToPartials = this._getPageNameToPartials(pagePartials);

    let localizedPagePartials = {};
    for (const locale of this._locales) {
      localizedPagePartials[locale] = [];
      for (const partials of Object.values(pageNameToPartials)) {
        const pagePartial = this._findPagePartialForLocale(locale, partials);

        if (pagePartial) {
          const localizedPartial = pagePartial.clone()
            .setLocale(locale);
          localizedPagePartials[locale].push(localizedPartial);
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
   * @param {Array<PagePartial>} partialsForPage
   * @returns {PagePartial}
   */
  _findPagePartialForLocale(locale, partialsForPage) {
    let pagePartial = partialsForPage.find(partial => this._isLocaleMatch(partial.getLocale(), locale));
    if (pagePartial) {
      return pagePartial;
    }

    const localeFallbacks = this._localeToFallbacks[locale] || [];
    for (const fallback of localeFallbacks) {
      pagePartial = partialsForPage.find(partial => this._isLocaleMatch(partial.getLocale(), fallback));

      if (pagePartial) {
        return pagePartial;
      }
    }

    return partialsForPage.find(partial => this._isDefaultLocale(partial.getLocale()));
  }

  /**
   * Builds an Object mapping pageName to PagePartials with for the corresponding page.
   *
   * @param {Array<PagePartial>} partials
   * @returns {Object<String, Array<PagePartial>>}
   */
  _getPageNameToPartials(partials) {
    if (!partials || partials.length < 1) {
      return {};
    }

    let pageNameToPartials = {};
    for (const pagePartial of partials) {
      const pageName = pagePartial.getPageName();
      if (!pageNameToPartials[pageName]) {
        pageNameToPartials[pageName] = [];
      }
      pageNameToPartials[pageName].push(pagePartial);
    }
    return pageNameToPartials;
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