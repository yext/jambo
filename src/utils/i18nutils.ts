import UserError from '../errors/usererror';

type ParsedLocale = { language: string, modifier?: string, region?: string };

/**
 * Normalizes a locale code
 */
export function canonicalizeLocale(localeCode: string): string {
  if (!localeCode) {
    return;
  }
  const { language, modifier, region } = parseLocale(localeCode);
  return formatLocale(language, modifier, region);
}

/**
 * Parses a locale code into its constituent parts.
 * Performs case formatting on the result.
 */
export function parseLocale(localeCode: string): ParsedLocale {
  const localeCodeSections = localeCode.replace(/-/g, '_').split('_');
  const language = localeCodeSections[0].toLowerCase();
  const parseModifierAndRegion = () => {
    const numSections = localeCodeSections.length;
    if (numSections === 1) {
      return {};
    } else if (numSections === 2 && language === 'zh') {
      const ambiguous = localeCodeSections[1].toLowerCase();
      if (['hans', 'hant'].includes(ambiguous)) {
        return { modifier: ambiguous };
      } else {
        return { region: ambiguous };
      }
    } else if (numSections === 2) {
      return { region: localeCodeSections[1] };
    } else if (numSections === 3) {
      return {
        modifier: localeCodeSections[1],
        region: localeCodeSections[2]
      };
    } else if (numSections > 3) {
      throw new UserError(
        `Encountered strangely formatted locale "${localeCode}", ` +
        `with ${numSections} sections.`);
    }
  };
  const capitalizeFirstLetterOnly = raw => {
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  };
  const parsedLocale = {
    language,
    ...parseModifierAndRegion()
  };

  if (parsedLocale.modifier) {
    parsedLocale.modifier = capitalizeFirstLetterOnly(parsedLocale.modifier);
  }
  if (parsedLocale.region) {
    parsedLocale.region = parsedLocale.region.toUpperCase();
  }

  return parsedLocale;
}

/**
 * Formats a locale code given its constituent parts.
 *
 * @param language zh in zh-Hans_CH
 * @param modifier Hans in zh-Hans_CH
 * @param region CH in zh-Hans_CH
 */
function formatLocale(language: string, modifier?: string, region?: string): string {
  let result = language.toLowerCase();
  if (modifier) {
    result += '-' + modifier;
  }
  if (region) {
    result += '_' + region;
  }
  return result;
}
