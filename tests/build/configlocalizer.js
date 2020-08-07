const { ConfigLocalizer } = require("../../src/commands/build/configlocalizer");
const { LocalizationConfig } = require("../../src/models/localizationconfig");
const { PageConfig } = require("../../src/models/pageconfig");

const localizationConfig = new LocalizationConfig({
  default: 'en',
  localeConfig: {
    en: {},
    es: {},
    fr: {
      fallback: [
        "es"
      ],
    },
    it: {
      fallback: [
        "en"
      ],
    }
  }
});

describe('localize', () => {
  it('localized config props override regular config props', () => {
    let configs = [
      new PageConfig({
        pageName: 'example',
        rawConfig: { test: 'default' },
      }),
      new PageConfig({
        pageName: 'example',
        locale: 'fr',
        rawConfig: { test: 'FR' },
      }),
    ];

    let localizedConfigs = new ConfigLocalizer({
      localizationConfig: localizationConfig,
      defaultLocale: 'en'
    }).createLocalizedPageConfigs(configs);

    configs.push(new PageConfig({
      pageName: 'example',
      locale: 'it',
      rawConfig: { test: 'default' },
    }));

    expect(localizedConfigs).toEqual([
      new PageConfig({
        pageName: 'example',
        locale: 'en',
        rawConfig: { test: 'default' },
      }),
      new PageConfig({
        pageName: 'example',
        locale: 'fr',
        rawConfig: { test: 'FR' },
      }),
      new PageConfig({
        pageName: 'example',
        locale: 'it',
        rawConfig: { test: 'default' },
      })
    ]);
  });
});

describe('mergeConfigs', () => {
  it('localized config props override regular config props', () => {
    let configs = [
      {
        test: 'default',
        test1: 'default'
      },
      { test: 'FR' },
    ];

    let mergedConfig = new ConfigLocalizer({
      localizationConfig: localizationConfig,
      defaultLocale: 'en'
    })._merge(configs);

    expect(mergedConfig).toEqual({
      test: 'FR',
      test1: 'default'
    });
  });
});
//   it('localized config props override regular config props deeper merge', () => {
//     let configs = [
//       new PageConfig({
//         pageName: 'example',
//         rawConfig: {
//           somethingMoreComplicated: {
//             test: ['default'],
//             test1: 'default'
//           },
//           test1: {
//             test: 'default'
//           },
//         }
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'fr',
//         rawConfig: {
//           somethingMoreComplicated: {
//             test: 'example',
//           }
//         }
//       }),
//     ];

//     let mergedConfig = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     }).localize(configs);

//     expect(mergedConfig).toEqual({
//       example: {
//         somethingMoreComplicated: {
//           test: 'example',
//         },
//         test1: {
//           test: 'default'
//         },
//       },
//     });
//   });

//   it('merge multiple locales WITH ONE FALLBACK', () => {
//     let configs = [
//       new PageConfig({
//         rawConfig: {
//           example: { test: 'test1' },
//         }
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'fr',
//         rawConfig: { test: 'test' },
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'en',
//         rawConfig: { example: 'ex' },
//       }),
//     ];

//     let mergedConfig = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     }).localize(configs);

//     expect(mergedConfig).toEqual({
//       example: {
//         example: 'ex',
//         test: 'test',
//       }
//     });
//   });

//   it('merge multiple locales WITH MULTIPLE FALLBACKS', () => {
//     let configs = [
//       new PageConfig({
//         rawConfig: {
//           example: { test: 'test1' },
//         }
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'fr',
//         rawConfig: { test: 'test' },
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'de',
//         rawConfig: { test2: 'test2' },
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'it',
//         rawConfig: { boooo: 'boooo' },
//       }),
//       new PageConfig({
//         pageName: 'example',
//         locale: 'en',
//         rawConfig: { example: 'ex' },
//       }),
//     ];

//     let mergedConfig = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     }).localize(configs);

//     expect(mergedConfig).toEqual({
//       example: {
//         example: 'ex',
//         test: 'test',
//         boooo: 'boooo',
//       }
//     });
//   });

//   it('merge with no fancy locale stuff', () => {
//     let configs = [
//       new PageConfig({
//         pageName: 'example1',
//         rawConfig: { test: 'test' },
//       }),
//       new PageConfig({
//         pageName: 'example2',
//         rawConfig: { test2: 'test2' },
//       }),
//       new PageConfig({
//         pageName: 'example3',
//         rawConfig: { boooo: 'boooo' },
//       }),
//       new PageConfig({
//         pageName: 'example4',
//         rawConfig: { example: 'ex' },
//       }),
//     ];
//     let mergedConfig = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     }).localize(configs);

//     expect(mergedConfig).toEqual(configs);
//   });
// });

// describe('_mergeConfigs', () => {
//   it('basic merge works', () => {
//     let mergedConfigs = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     })
//       ._mergeConfigs({ a: 'a'}, {b: 'b'});

//     expect(mergedConfigs).toEqual({
//       a: 'a',
//       b: 'b'
//     });
//   });

//   it('this is a shallow merge', () => {
//     let config1 = { a: { b: 'b' } };
//     let config2 = { a: { a: 'a' } };
//     let mergedConfigs = new ConfigLocalizer({
//       localizationConfig: localizationConfig,
//       defaultLocale: 'en'
//     })
//       ._mergeConfigs(
//         config1,
//         config2
//       );

//     expect(mergedConfigs).toEqual(config2);
//   });
// });

// // describe('mergeConfigsForLocale', () => {
// //   it('localized config props override regular config props', () => {
// //     let configs = [
// //       example: { test: 'default' },
// //       'example.fr': { test: 'FR' },
// //     };

// //     let mergedConfig = new ConfigMerger()
// //       .mergeConfigsForLocale(configs, [], 'fr');

// //     expect(mergedConfig).toEqual({
// //       example: {
// //         test: 'FR',
// //       }
// //     });
// //   });

// //   it('localized config props override regular config props deeper merge', () => {
// //     let configs = [
// //       example: {
// //         somethingMoreComplicated: {
// //           test: ['default'],
// //           test1: 'default'
// //         },
// //         test1: {
// //           test: 'default'
// //         },
// //       },
// //       'example.fr': {
// //         somethingMoreComplicated: {
// //           test: 'example',
// //         }
// //       },
// //     };

// //     let mergedConfig = new ConfigMerger()
// //       .mergeConfigsForLocale(configs, [], 'fr');

// //     expect(mergedConfig).toEqual({
// //       example: {
// //         somethingMoreComplicated: {
// //           test: 'example',
// //         },
// //         test1: {
// //           test: 'default'
// //         },
// //       },
// //     });
// //   });

// //   it('merge multiple locales WITH ONE FALLBACK', () => {
// //     let configs = [
// //       example: { test: 'test1' },
// //       'example.fr': { test: 'test' },
// //       'example.en': { example: 'ex' },
// //     };

// //     let mergedConfig = new ConfigMerger()
// //       .mergeConfigsForLocale(configs, ['en'], 'fr');

// //     expect(mergedConfig).toEqual({
// //       example: {
// //         example: 'ex',
// //         test: 'test',
// //       }
// //     });
// //   });

// //   it('merge multiple locales WITH MULTIPLE FALLBACKS', () => {
// //     let configs = [
// //       example: { test: 'test1' },
// //       'example.fr': { test: 'test' },
// //       'example.de': { test2: 'test2' },
// //       'example.it': { boooo: 'boooo' },
// //       'example.en': { example: 'ex' },
// //     };

// //     let mergedConfig = new ConfigMerger()
// //       .mergeConfigsForLocale(configs, ['it', 'en'], 'fr'); // TODO is this the right order?

// //     expect(mergedConfig).toEqual({
// //       example: {
// //         example: 'ex',
// //         test: 'test',
// //         boooo: 'boooo',
// //       }
// //     });
// //   });

// //   it('merge with no fancy locale stuff', () => {
// //     let configs = [
// //       example: { test: 'test1' },
// //       fr: { test: 'test' },
// //       de: { test2: 'test2' },
// //       it: { boooo: 'boooo' },
// //       en: { example: 'ex' },
// //     };

// //     let mergedConfig = new ConfigMerger()
// //       .mergeConfigsForLocale(configs, ['it', 'en'], 'fr');

// //     expect(mergedConfig).toEqual(configs);
// //   });
// // });

// // describe('_mergeConfigs', () => {
// //   it('basic merge works', () => {
// //     let mergedConfigs = new ConfigMerger()
// //       ._mergeConfigs({ a: 'a'}, {b: 'b'});

// //     expect(mergedConfigs).toEqual({
// //       a: 'a',
// //       b: 'b'
// //     });
// //   });

// //   it('this is a shallow merge', () => {
// //     let config1 = { a: { b: 'b' } };
// //     let config2 = { a: { a: 'a' } };
// //     let mergedConfigs = new ConfigMerger()
// //       ._mergeConfigs(
// //         config1,
// //         config2
// //       );

// //     expect(mergedConfigs).toEqual(config2);
// //   });
// // });
