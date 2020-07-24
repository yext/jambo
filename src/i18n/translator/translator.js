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