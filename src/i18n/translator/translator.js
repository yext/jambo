const i18next = require('i18next');

/**
 * This class is a wrapper around the i18next library. It provides translation
 * methods for a given locale. These methods allow for interpolation, pluralization,
 * and added context.
 */
class Translator {
  /**
   * Creates a new {@link Translator} that wraps the provided {@link i18next} instance.
   * 
   * @param {i18next} i18nextInstance The instance to wrap.
   */
  constructor(i18nextInstance) {
    this._i18next = i18nextInstance;
  }

  /**
   * Performs a simple translation of the given phrase. The translated phrase can be
   * interpolated.
   * 
   * @param {string} phrase The phrase to translate.
   * @param {Object<string,?>} interpValues Optional, any values needed for interpolation.
   */
  translate(phrase, interpValues) {
    return this._i18next.t(phrase, interpValues);
  }

  /**
   * Translates the provided phrase. Depending on the count, either the singular or
   * plural form of the translation will be supplied. The translated phrase can be
   * interpolated.
   * 
   * @param {string} phrase The phrase to translate.
   * @param {string} pluralForm The untranslated, plural form of the phrase.
   * @param {number} count A count used to switch between singular and plural forms.
   * @param {Object<string, ?>} interpValues Optional, any values needed to interpolate
   *                                         the translated string.
   */
  translatePlural(phrase, pluralForm, count, interpValues) {
    const parsedInterpValues = { ...interpValues, count };

    // If i18next has no translations for the phrase and the count is not
    // unity, we should fallback to the pluralForm. We use i18next.t to allow
    // the pluralForm to be interpolated.
    return this._i18next.exists(phrase) || count === 1 ?
      this._i18next.t(phrase, parsedInterpValues) :
      this._i18next.t(pluralForm, parsedInterpValues);
  }

  /**
     * Translates the provided phrase depending on the context.
     * Supports interpolation.
   * 
   * @param {string} phrase The phrase to translate.
   * @param {string} context The context of the translation
   * @param {Object<string, ?>} interpValues Optional, any values needed to interpolate
   *                                         the translated string.
   */
  translateWithContext(phrase, context, interpValues) {
    const parsedInterpValues = { ...interpValues, 'context': context};

    return this._i18next.t(phrase, parsedInterpValues);
  }

  /**
   * Creates a {@link Translator} for the given locale, wrapping a properly configured,
   * new {@link i18next} instance.
   * 
   * @param {string} locale The desired locale.
   * @param {Array<string>} fallbacks A prioritized list of translation fallbacks
   *                                  for the locale.
   * @param {string} translations The translations for the locale and associated fallbacks.
   */
  static async create(locale, fallbacks, translations) {
    const i18nextInstance = i18next.createInstance();
    await i18nextInstance.init({
      lng: locale,
      fallbackLng: fallbacks,
      resources: translations,
    });
    const translator = new Translator(i18nextInstance);

    return translator;
  }
}

module.exports = Translator;