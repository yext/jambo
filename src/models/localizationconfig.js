/**
 * Data model for the locale_config file.
 */

// TODO assumes language and suffix of locale are separated by a "-" (e.g. en-US)
module.exports = class LocalizationConfig {
  constructor(localizationConfig) {
    const config = localizationConfig || {};
    this._defaultLocale = config.default || ''; // TODO do we want this to be the default

    /**
     * localeToConfig is an Object mapping locale to configuration
     * {
     *   'locale': {
     *     experienceKey: ''   // String
     *     apiKey: ''          // String
     *     params: {}          // Object
     *     urlOverride: ''     // String
     *     translationFile: '' // String
     *   },
     *   ...
     * }
     */
    this._localeToConfig = config.localeConfig || {};

    const urlFormat = config.urlFormat || {};
    this._defaultUrlPattern = urlFormat.default || '';
    this._baseLocalePattern = urlFormat.baseLocale || '';
  }

  getDefaultLocale () {
    return this._defaultLocale;
  }

  getLocales () {
    return Object.keys(this._localeToConfig);
  }

  getApiKey (locale) {
    return this._getConfigForLocale(locale).apiKey;
  }

  getExperienceKey (locale) {
    return this._getConfigForLocale(locale).experienceKey;
  }

  getParams (locale) {
    return this._getConfigForLocale(locale).params || {};
  }

  getTranslationFile (locale) {
    return this._getConfigForLocale(locale).translationFile;
  }

  getFallbacks (locale) {
    return this._getConfigForLocale(locale).fallback || [];
  }

  /**
   * Returns the URL formatting function for a given locale
   *
   * @param {string} locale
   * @returns {function}
   */
  getUrlFormatter (locale) {
    const language = locale
      ? locale.substring(0, locale.lastIndexOf("-")) || locale
      : '';
    const basicUrlPattern = locale === this._defaultLocale
      ? this._baseLocalePattern
      : this._defaultUrlPattern;
    let urlPattern = this._getUrlOverride(locale) || basicUrlPattern || '{pageName}.{pageExt}';
    return (pageName, pageExt) => {
      return urlPattern
        .replace('{language}', language)
        .replace('{locale}', locale)
        .replace('{pageName}', pageName)
        .replace('{pageExt}', pageExt);
    };
  }

  /**
   * Returns the localeConfig for a given locale
   *
   * @param {Object} locale
   * @returns {Object}
   */
  _getConfigForLocale (locale) {
    return this._localeToConfig[locale] || {};
  }

  /**
   * Returns the URL Override pattern if exists a given locale
   *
   * @param {Object} locale
   * @returns {string}
   */
  _getUrlOverride (locale) {
    return this._getConfigForLocale(locale).urlOverride;
  }
}
