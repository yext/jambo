const { canonicalizeLocale } = require('../../src/utils/i18nutils');

describe('canonicalizeLocale correctly normalizes locales', () => {
  it('converts to language to lower case and region to upper case', () => {
    const locale = 'FR_ch';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr_CH');
  });

  it('converts dashes to underscores', () => {
    const locale = 'fr-CH';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr_CH');
  });
});