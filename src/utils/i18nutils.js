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
  return localeCode.toLowerCase();
}
exports.canonicalizeLocale = canonicalizeLocale;