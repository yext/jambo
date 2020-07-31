/**
 * Merges the relevant page configurations based on locale
 */
exports.ConfigLocalizer = class {
  /**
   * Merges the relevant page configurations based on locale. If there
   * is no locale data provided, this will return a copy of the original
   * page config.
   *
   * @param {Object} configIdToConfig
   * @param {string} locale
   * @param {Array<string>} localeFallbacks
   * @returns {Object}
   */
  generateLocalizedPageConfigs(configIdToConfig, locale, localeFallbacks) {
    let configs = { ...configIdToConfig };
    if (localeFallbacks && localeFallbacks.length) {
      for (const configId of Object.keys(configs)) {
        for (let i = localeFallbacks.length - 1; i >= 0 ; i--) {
          let fallbackLocale = localeFallbacks[i]
          configs[configId] = this._mergeConfigs(
            configs[configId],
            configs[`${configId}.${fallbackLocale}`]
          );
        }
      }
    }

    let pageIdToConfig = {};
    for (const [configId, pageConfig] of Object.entries(configs)) {
      let isConfigNamePageId = !configId.includes('.');
      if (isConfigNamePageId) {
        pageIdToConfig[configId] = this._mergeConfigs(
          pageConfig,
          configs[`${configId}.${locale}`]
        );
      }
    }

    // TODO (agrow) consolidate this method a bit by using reduce.
    return pageIdToConfig;
  }

  /**
   * Merges two objects. This is a shallow merge, the second argument takes precedent.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object}
   */
  _mergeConfigs(config1, config2) {
    const a = config1 || {};
    const b = config2 || {};
    return Object.assign({}, a, b);
  }
}