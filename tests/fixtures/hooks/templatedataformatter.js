/**
 * A test data formatter hook.
 *
 * @param {string} pageMetadata.relativePath relativePath from the page to the output dir
 * @param {string} pageMetadata.pageName name of the page being build
 
 * @param {Object} siteLevelAttributes.globalConfig global_config.json
 * @param {Object} siteLevelAttributes.currentLocaleConfig the chunk of locale config for the current locale
 * @param {string} siteLevelAttributes.locale the current locale
 * @param {Object} siteLevelAttributes.env all environment variables, like JAMBO_INJECTED_DATA
 * 
 * @param {Object} pageNameToConfig object of pageName to pageConfig
 */
module.exports = function (pageMetadata, siteLevelAttributes, pageNameToConfig) {
  return {
    aPageMetadata: pageMetadata,
    someSiteLevelAttributes: siteLevelAttributes,
    aPageNameToConfig: pageNameToConfig
  };
}