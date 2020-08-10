/**
 * GlobalConfig is a representation of the a global_config file.
 */
module.exports = class GlobalConfig {
	/**
	 * @param {Object} rawConfig
	 */
  constructor(rawConfig) {
		/**
		 * @type {Object}
		 */
    this.rawConfig = rawConfig || {};
  }

	/**
	 * Returns the locale
	 *
	 * @returns {String}
	 */
  getLocale() {
    return this.rawConfig.locale;
  }

	/**
	 * Returns the experienceKey
	 *
	 * @returns {String}
	 */
  getExperienceKey() {
    return this.rawConfig.experienceKey;
  }

	/**
	 * Returns the apiKey
	 *
	 * @returns {String}
	 */
  getApiKey() {
    return this.rawConfig.apiKey;
  }

	/**
	 * Returns the raw config
	 *
	 * @returns {Object}
	 */
  getConfig() {
    return this.rawConfig;
  }
}