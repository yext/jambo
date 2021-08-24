const { canonicalizeLocale, parseLocale } = require('../../src/utils/i18nutils');

describe('canonicalizeLocale correctly normalizes locales', () => {
  it('converts language to lower case and region to upper case', () => {
    const locale = 'FR_ch';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr_CH');
  });

  it('converts dashes to underscores', () => {
    const locale = 'fr-CH';
    const canonicalizedLocale = canonicalizeLocale(locale);
    expect(canonicalizedLocale).toEqual('fr_CH');
  });

  describe('works for chinese', () => {
    function runTest(testName, inputLocale, expectedLocale) {
      it(testName, () => {
        expect(canonicalizeLocale(inputLocale)).toEqual(expectedLocale);
      });
    }
    const testCases = [
      ['using dashes', 'zh-Hans-CH'],
      ['using underscores', 'zh_Hans_CH'],
      ['underscore then dash', 'zh_Hans-CH'],
      ['dash then underscore', 'zh-Hans_CH'],
      ['updates casing', 'ZH-hans_Ch'],
      ['does not have region code', 'zh-hans', 'zh-Hans'],
      ['has region but no modifier', 'zh-cH', 'zh_CH']
    ];
    const expected = 'zh-Hans_CH';
    for (const [testName, inputLocale, specificExpected] of testCases) {
      runTest(testName, inputLocale, specificExpected || expected);
    }
  });
});

describe('parseLocale', () => {
  it('performs case formatting', () => {
    expect(parseLocale('Zh-hans-Ch')).toEqual({
      language: 'zh',
      modifier: 'Hans',
      region: 'CH'
    })
  });

  it('chinese with modifier only', () => {
    expect(parseLocale('ZH_HANS')).toEqual({
      language: 'zh',
      modifier: 'Hans'
    })
  });

  it('chinese with region only', () => {
    expect(parseLocale('ZH-cH')).toEqual({
      language: 'zh',
      region: 'CH'
    })
  });

  it('2 section non-chinese locale', () => {
    expect(parseLocale('FR-freE')).toEqual({
      language: 'fr',
      region: 'FREE'
    });
  });

  it('simple language', () => {
    expect(parseLocale('FR')).toEqual({
      language: 'fr'
    });
  });
});
