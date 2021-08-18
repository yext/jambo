const { warn } = require('./logger');

/**
 * Normalizes a locale code
 *
 * @param {string} localeCode
 * @returns {string}
 */
canonicalizeLocale = function(localeCode) {
  if (!localeCode) {
    return;
  }
  const localeCodeSections = localeCode.replace(/-/g, '_').split('_');
  const numSections = localeCodeSections.length;
  const language = localeCodeSections[0].toLowerCase();
  if (numSections === 1) {
    return language;
  } else if (numSections === 2) {
    if (language === 'zh') {
      return formatLocale(language, localeCodeSections[1]);
    }
    return formatLocale(language, null, localeCodeSections[1]);
  } else if (numSections === 3) {
    return formatLocale(language, localeCodeSections[1], localeCodeSections[2]);
  } else if (numSections > 3) {
    warn(
      `Encountered strangely formatted locale "${localeCode}", ` +
      `with ${numSections} sections.`);
    return localeCode;
  }
}
exports.canonicalizeLocale = canonicalizeLocale;

/**
 * Formats a locale code given its constituent parts.
 *
 * @param {string} language zh in zh-Hans_CH
 * @param {string?} modifier Hans in zh-Hans_CH
 * @param {string?} region CH in zh-Hans_CH
 * @returns 
 */
function formatLocale(language, modifier, region) {
  let result = language.toLowerCase();
  if (modifier) {
    result += '-' + modifier.charAt(0).toUpperCase() + modifier.slice(1).toLowerCase();
  }
  if (region) {
    result += '_' + region.toUpperCase();
  }
  return result;
}