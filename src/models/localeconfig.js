/**
 * Data model for the locale_config file.
 */

// TODO assumes language and suffix of locale are separated by a "-" (e.g. en-US)
exports.LocaleConfig = class {
  constructor({ localeConfig, localeConfigName, directoryConfigName}) {
    if (!localeConfig) {
      console.warn(`Cannot find ${localeConfigName} file in ${directoryConfigName} directory, writing pages without locale information.`);
    }

    let config = localeConfig || {};
    this._defaultLocale = config.default || '';

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

    let urlFormat = config.urlFormat || {};
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
    return this._getConfigForLocale(locale).fallbacks || [];
  }

  /**
   * Returns the URL formatting function for a given locale
   *
   * @param {Object} locale
   * @param {Object} urlOverride the pattern to use if overriding the URL pattern for this locale
   * @returns {function}
   */
  getUrlFormatter (locale) {
    const language = locale ? locale.substring(0, locale.lastIndexOf("-")) || locale : ''; // TODO do we wanna standardize with underscores?
    const basicUrlPattern = locale === this._defaultLocale ? this._baseLocalePattern : this._defaultUrlPattern;
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