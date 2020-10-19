const { canonicalizeLocale } = require('../../src/utils/i18nutils');

describe('canonicalizeLocale correctly normalizes locales', () => {
  it('converts to lower case', () => {
    const locale = 'FR_CH';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr_ch');
  });
});