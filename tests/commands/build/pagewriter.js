const PageWriter = require('../../../src/commands/build/pagewriter');
const PageSet = require('../../../src/models/pageset');
const Page = require('../../../src/models/page');
const PageConfig = require('../../../src/models/pageconfig');
const GlobalConfig = require('../../../src/models/globalconfig');

describe('PageWriter builds the object passed to the Handlebars Templates properly', () => {
  it('builds args as expected when all are present', () => {
    const env = {
      envVar: 'envVar',
    };
    const path = 'relativePath';
    const pageConfig = {
      pageConfigParam: 'param',
    };
    const sdkBundleLocale = 'en';
    const params = {
      param: 'test'
    };
    const globalConfig = {
      apiKey: 'apiKey'
    };

    const pageSet = new PageSet({
      locale: 'en-US',
      pages: [
        new Page({
          pageConfig: new PageConfig({
            pageName: 'page1',
            rawConfig: {
              prop: 'example'
            }
          })
        }),
        new Page({
          pageConfig: new PageConfig({
            pageName: 'page2',
            rawConfig: {
              prop: 'example2'
            }
          })
        })
      ],
      globalConfig: new GlobalConfig(globalConfig),
      params: params,
      sdkBundleLocale: sdkBundleLocale
    });

    const args = new PageWriter({
      env: env
    })._buildArgsForTemplate(pageConfig, path, pageSet);

    expect(args).toEqual({
      ...pageConfig,
      verticalConfigs: pageSet.getPageNameToConfig(),
      global_config: globalConfig,
      params: params,
      sdkBundleLocale: sdkBundleLocale,
      relativePath: path,
      env: env
    });
  });
});
