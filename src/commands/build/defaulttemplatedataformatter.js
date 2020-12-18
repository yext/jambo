/**
 * This is the default data formatting for the data passed into handlebars
 * templates during Jambo builds.
 *
 * @param {string} pageMetadata.relativePath relativePath from the page to the output dir
 * @param {string} pageMetadata.pageName name of the page being built
 *
 * @param {Object} siteLevelAttributesglobalConfig global_config.json
 * @param {Object} siteLevelAttributes.currentLocaleConfig
 *                 the chunk of locale config for the current locale
 * @param {string} siteLevelAttributes.locale the current locale
 * @param {Object} siteLevelAttributes.env
 *                 all environment variables, like JAMBO_INJECTED_DATA
 * 
 * @param {Object} pageNameToConfig
 *                 object of pageName to pageConfig, for all pages in localized page set
 */
module.exports = function defaultTemplateDataFormatter(
  pageMetadata,
  siteLevelAttributes,
  pageNameToConfig
) {
  const { relativePath, pageName } = pageMetadata;
  const { globalConfig, currentLocaleConfig, locale, env } = siteLevelAttributes;
  const currentPageConfig = pageNameToConfig[pageName];
  const templateData = {
    ...currentPageConfig,
    verticalConfigs: pageNameToConfig,
    global_config: getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale),
    params: currentLocaleConfig.params || {},
    relativePath,
    env
  };
  return templateData;
}

/**
 * Gets the global config, with experienceKey and locale added
 * to it from the currentLocaleConfig.
 * 
 * @param {Object} globalConfig 
 * @param {string} currentLocaleConfig chunk of locale config for the current locale
 * @param {string} locale the current locale
 */
function getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale) {
  const localizedGlobalConfig = {
    ...globalConfig
  };
  const { experienceKey } = currentLocaleConfig;
  if (experienceKey) {
    localizedGlobalConfig.experienceKey = experienceKey;
  }
  if (locale) {
    localizedGlobalConfig.locale = locale;
  }
  return localizedGlobalConfig;
}