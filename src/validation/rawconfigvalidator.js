const GlobalConfigValidator = require('./globalconfigvalidator');
const LocaleConfigValidator = require('./localeconfigvalidator');
const PageConfigsValidator = require('./pageconfigsvalidator');
const { ConfigKeys } = require('../constants');
const cloneDeep = require('lodash/cloneDeep');
const { canonicalizeLocale } = require('../utils/i18nutils');

/**
 * Performs validation on the raw configuration files
 * including global_config.json, locale_config.json, and
 * the various page configurations
 */
module.exports = class RawConfigValidator {
  constructor(configNameToRawConfig) {
    /**
     * @type {Object<string, Object>}
     */
    this._configNameToRawConfig = configNameToRawConfig;
  }

  /**
   * Performs a series of validation steps
   *
   * @throws {UserError} Thrown if validation fails
   */
  validate() {
    new GlobalConfigValidator(this._getGlobalConfig()).validate();

    if (this._isMultiLanguageSite()) {
      new LocaleConfigValidator(this._getLocaleConfig()).validate();
      new PageConfigsValidator(this._getPageConfigs(), this._getConfiguredLocales())
        .validate();
    }
  }

  /**
   * @returns {boolean} True if the site is configured for multiple languages
   */
  _isMultiLanguageSite() {
    return Boolean(this._getLocaleConfig());
  }

  /**
   * @returns {Object<string, string>}
   */
  _getGlobalConfig() {
    return this._configNameToRawConfig[ConfigKeys.GLOBAL_CONFIG];
  }

  /**
   * @returns {Object<string, string|Object>}
   */
  _getLocaleConfig() {
    return this._configNameToRawConfig[ConfigKeys.LOCALE_CONFIG];
  }

  /**
   * @returns {Object<string, string|Object>} The keys are locale strings
   */
  _getPageConfigs() {
    const pageConfigs = cloneDeep(this._configNameToRawConfig);

    delete pageConfigs[ConfigKeys.LOCALE_CONFIG];
    delete pageConfigs[ConfigKeys.GLOBAL_CONFIG];

    return pageConfigs;
  }

  /**
   * Gets the locale keys inside localeConfig of locale_config.json,
   * and canonicalizes them.
   *
   * @type {string[]}
   */
  _getConfiguredLocales() {
    return Object.keys(this._getLocaleConfig()['localeConfig'])
      .map(canonicalizeLocale);
  }
}