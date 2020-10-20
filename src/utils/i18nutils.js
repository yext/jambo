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
  const localeCodeSections = localeCode.replace('-', '_')
    .split('_');

  const languageIndex = 0;
  const regionIndex = 1;

  localeCodeSections[languageIndex] = localeCodeSections[languageIndex].toLowerCase();

  if (localeCodeSections.length > regionIndex) {
    localeCodeSections[regionIndex] = localeCodeSections[regionIndex].toUpperCase();
  }

  return localeCodeSections.join('_');
}
exports.canonicalizeLocale = canonicalizeLocale;