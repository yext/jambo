const { canonicalizeLocale } = require('./i18nutils');
/**
 * Parses the locale from a given configName
 *
 * @param {String} configName the file name of the config, without the extension
 * @returns {String}
 */
parseLocale = function(configName) {
  const configNameParts = configName.split('.');
  const locale = configNameParts.length > 1 && configNameParts[1];
  return canonicalizeLocale(locale);
}
exports.parseLocale = parseLocale;

/**
 * Returns true if the provided configName contains a locale
 *
 * @param {String} configName the file name of the config, without the extension
 * @returns {Boolean}
 */
containsLocale = function(configName) {
  const configNameParts = configName.split('.');
  return configNameParts.length > 1;
}
exports.containsLocale = containsLocale;