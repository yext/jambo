/**
 * ThemeConfig is a representation of a jambo_theme.json file.
 */
module.exports = class ThemeConfig {
  /**
   * @param {Object} rawConfig
   */
  constructor(rawConfig = {}) {
    /**
     * @type {Object}
     */
    this.build = rawConfig.build || {};
  }

  /**
   * Returns the locale
   *
   * @returns {String}
   */
  getCustomHbsHelpersFile() {
    return this.build.customHbsHelpersFile;
  }
}