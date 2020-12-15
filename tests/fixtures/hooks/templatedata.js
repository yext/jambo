/**
 * A test hook for the template data hook.
 */
module.exports = function ({
  pageConfig,
  relativePath,
  params,
  globalConfig,
  pageNameToConfig,
  env 
}) {
  return {
    aPageConfig: pageConfig,
    aRelativePath: relativePath,
    aParams: params,
    aGlobalConfig: globalConfig,
    aPageNameToConfig: pageNameToConfig,
    anEnv: env
  }
}