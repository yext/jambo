const UserError = require('../errors/usererror');

/**
 * Normalizes a locale code
 *
 * @param {string} localeCode
 * @returns {string}
 */
exports.canonicalizeLocale = function(localeCode) {
  if (!localeCode) {
    return;
  }
  const { language, modifier, region } = parseLocale(localeCode);
  return formatLocale(language, modifier, region);
}

/**
 * Parses a locale code into its constituent parts.
 * 
 * @param {string} localeCode 
 * @returns { language: string, modifier?: string, region?: string } 
 */
function parseLocale(localeCode) {
  const localeCodeSections = localeCode.replace(/-/g, '_').split('_');
  const numSections = localeCodeSections.length;
  const language = localeCodeSections[0].toLowerCase();
  if (numSections === 1) {
    return { language };
  } else if (numSections === 2) {
    if (language === 'zh') {
      return {
        modifier: localeCodeSections[1],
        language
      };
    }
    return {
      region: localeCodeSections[1],
      language
    }
  } else if (numSections === 3) {
    return {
      modifier: localeCodeSections[1],
      region: localeCodeSections[2],
      language
    }
  } else if (numSections > 3) {
    throw new UserError(
      `Encountered strangely formatted locale "${localeCode}", ` +
      `with ${numSections} sections.`);
  }
}

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