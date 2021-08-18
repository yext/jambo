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
  if (numSections === 1) {
    return localeCodeSections[0].toLowerCase();
  } else if (numSections === 2) {
    const language = localeCodeSections[0].toLowerCase();
    const region = localeCodeSections[1].toUpperCase();
    return `${language}_${region}`; 
  } else if (numSections === 3) {
    const language = localeCodeSections[0].toLowerCase();
    const rawModifier = localeCodeSections[1];
    const languageModifier =
      rawModifier.charAt(0).toUpperCase() + rawModifier.slice(1).toLowerCase();
    const region = localeCodeSections[2].toUpperCase();
    return `${language}-${languageModifier}_${region}`;
  } else if (numSections > 3) {
    warn(
      `Encountered strangely formatted locale "${localeCode}", ` +
      `with ${numSections} sections.`);
    return localeCode;
  }
}
exports.canonicalizeLocale = canonicalizeLocale;