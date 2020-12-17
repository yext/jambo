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
	 * Returns the raw config
	 *
	 * @returns {Object}
	 */
  getConfig() {
    return this.rawConfig;
  }
}