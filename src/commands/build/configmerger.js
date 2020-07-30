
/**
 * Merges the relevant page configurations based on locale
 */
exports.ConfigMerger = class {
  /**
   * Merges the relevant page configurations based on locale. If there
   * is no locale data provided, this will return a copy of the original
   * page config.
   *
   * @param {Object} verticalConfigs
   * @param {Array} localeFallbacks
   * @param {string} locale
   * @returns {Object}
   */
  mergeConfigsForLocale(verticalConfigs, localeFallbacks, locale) {
    let pageConfigs = { ...verticalConfigs };
    if (localeFallbacks) {
      for (const configName of Object.keys(pageConfigs)) {
        for (let fallbackLocale of localeFallbacks) { // TODO is this backwards
          pageConfigs[configName] = this._mergeConfigs(
            pageConfigs[configName],
            pageConfigs[`${configName}.${fallbackLocale}`]
          );
        }
      }
    }

    let mergedConfigs = {};
    for (const [configName, pageConfig] of Object.entries(pageConfigs)) {
      if (!configName.includes('.')) {
        mergedConfigs[configName] = this._mergeConfigs(
          pageConfig,
          pageConfigs[`${configName}.${locale}`]
        );
      }
    }
    return mergedConfigs;
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