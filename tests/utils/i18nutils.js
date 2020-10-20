const { canonicalizeLocale } = require('../../src/utils/i18nutils');

describe('canonicalizeLocale correctly normalizes locales', () => {
  it('converts to language to lower case and region to upper case', () => {
    const locale = 'FR-ch';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr-CH');
  });

  it('converts underscores to dashes', () => {
    const locale = 'fr_CH';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr-CH');
  });
});