const { NO_LOCALE } = require('../constants');
const { canonicalizeLocale } = require('../utils/i18nutils');
const UserError = require('../errors/usererror');

/**
 * LocalizationConfig represents the configuration required to localize pages. It contains
 * configuration and URL formatting for each locale.
 */
module.exports = class LocalizationConfig {
  /**
   * @param {Object} rawLocalizationConfig
   */
  constructor(rawLocalizationConfig) {
    const config = rawLocalizationConfig || {};
    this._defaultLocale = canonicalizeLocale(config.default) || NO_LOCALE;

    /**
     * localeToConfig is an Object mapping locale to configuration
     * {
     *   'locale': {
     *     experienceKey: ''   // String
     *     params: {}          // Object
     *     urlOverride: ''     // String
     *     translationFile: '' // String
     *   },
     *   ...
     * }
     */
    this._localeToConfig = {};
    for (const [localeCode, localeConfig] of Object.entries(config.localeConfig || {})) {
      const normalizedLocale = canonicalizeLocale(localeCode);
      this._localeToConfig[normalizedLocale] = localeConfig;
    };

    if (this.hasConfig() && !this._localeToConfig[this._defaultLocale]) {
      throw new UserError(
        'A \'default\' locale with an entry in the locale config is required');
    }

    const urlFormat = config.urlFormat || {};
    this._defaultUrlPattern = urlFormat.default || '';
    this._baseLocalePattern = urlFormat.baseLocale || '';
  }

  /**
   * Returns a boolean indicating whether this LocalizationConfig has
   * configuration. It returns false when there is no meaningful
   * configuration for locales, and true when there is configuration.
   *
   * @returns {boolean}
   */
  hasConfig() {
    return Object.keys(this._localeToConfig).length > 0;
  }

  getDefaultLocale() {
    return this._defaultLocale;
  }

  getLocales() {
    return Object.keys(this._localeToConfig);
  }

  getTranslationFile(locale) {
    return this.getConfigForLocale(locale).translationFile;
  }

  getFallbacks(locale) {
    return this.getConfigForLocale(locale).fallback || [];
  }

  /**
   * Returns the URL formatting function for a given locale
   *
   * @param {string} locale
   * @returns {function}
   */
  getUrlFormatter(locale) {
    const language = locale.split('_')[0];
    const basicUrlPattern = locale === this._defaultLocale
      ? this._defaultUrlPattern
      : this._baseLocalePattern;
    let urlPattern = this._getUrlOverride(locale)
      || basicUrlPattern
      || '{pageName}.{pageExt}';
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
  getConfigForLocale(locale) {
    return this._localeToConfig[locale] || {};
  }

  /**
   * Returns the URL Override pattern if exists a given locale
   *
   * @param {Object} locale
   * @returns {string}
   */
  _getUrlOverride(locale) {
    return this.getConfigForLocale(locale).urlOverride;
  }
}
