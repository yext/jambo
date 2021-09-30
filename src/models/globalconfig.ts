/**
 * GlobalConfig is a representation of the a global_config file.
 */
export default class GlobalConfig {
	rawConfig: any;

	/**
	 * @param {Object} rawConfig
	 */
	constructor(rawConfig: any) {
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