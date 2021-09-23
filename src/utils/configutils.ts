import { canonicalizeLocale } from './i18nutils';
/**
 * Parses the locale from a given configName
 *
 * @param {String} configName the file name of the config, without the extension
 * @returns {String}
 */
export function parseLocale(configName: string) {
  const configNameParts = configName.split('.');
  const locale = configNameParts.length > 1 && configNameParts[1];
  return canonicalizeLocale(locale);
}

/**
 * Returns true if the provided configName contains a locale
 *
 * @param {String} configName the file name of the config, without the extension
 * @returns {Boolean}
 */
export function containsLocale(configName: string) {
  const configNameParts = configName.split('.');
  return configNameParts.length > 1;
}