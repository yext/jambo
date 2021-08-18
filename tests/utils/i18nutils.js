const { canonicalizeLocale } = require('../../src/utils/i18nutils');

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
  const testCases = [
    ['using dashes', 'zh-Hans-CH'],
    ['using underscores', 'zh_Hans_CH'],
    ['underscore then dash', 'zh_Hans-CH'],
    ['dash then underscore', 'zh-Hans_CH'],
    ['updates casing', 'zh-hans_ch'],
  ];
  const expected = 'zh-Hans_CH';
  for (const [testName, inputLocale] of testCases) {
    runTest(testName, inputLocale, expected);
  }
});

function runTest(testName, inputLocale, expectedLocale) {
  it(testName, () => {
    expect(canonicalizeLocale(inputLocale)).toEqual(expectedLocale);
  });
}