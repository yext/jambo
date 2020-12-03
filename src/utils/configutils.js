const { canonicalizeLocale } = require('./i18nutils');
const { parse } = require('comment-json');
const fs = require('file-system');

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

/**
 * Parse a comment-json config file.
 * 
 * @param {string} path e.g. config/global_config.json
 * @returns {Object} the raw config object
 */
parseConfigFile = function(path) {
  try {
    return parse(fs.readFileSync(path, 'utf8'), null, true);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new UserError( `JSON SyntaxError: could not parse file ${path}`, err.stack);
    } else {
      throw err;
    }
  }
}
exports.parseConfigFile = parseConfigFile;