/**
 * This is the default data formatting for the data passed into the
 * handlebars templates Jambo builds.
 *
 * @param {Object} pageMetadata contents below
 * @param {string} relativePath relativePath from the page to the output dir
 * @param {string} pageName name of the page being build
 *
 * @param {Object} siteLevelAttributes contents below
 * @param {Object} globalConfig global_config.json
 * @param {Object} currentLocaleConfig the chunk of locale config for the current locale
 * @param {string} locale the current locale
 * @param {Object} env all environment variables, like JAMBO_INJECTED_DATA
 * 
 * @param {Object} pageNameToConfig object of pageName to pageConfig
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