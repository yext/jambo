const PageWriter = require('../../../src/commands/build/pagewriter');

describe('PageWriter builds args for Handlebars Templates properly', () => {
  it('builds args as expected when all are present', () => {
    const env = {
      envVar: 'envVar',
    };
    const pageConfig = {
      pageConfigParam: 'param',
    };
    const path = 'relativePath';
    const params = {
      param: 'test'
    };
    const globalConfig = {
      apiKey: 'apiKey'
    };
    const pageNameToConfig = {
      page1: {
        config: {
          prop: 'example'
        }
      },
      page2: {
        config: {
          prop: 'example2'
        }
      }
    };

    const args = new PageWriter({
      env: env
    })._buildArgsForTemplate({
      pageConfig: pageConfig,
      params: params,
      relativePath: path,
      globalConfig: globalConfig,
      pageNameToConfig: pageNameToConfig
    });

    expect(args).toEqual({
      ...pageConfig,
      verticalConfigs: pageNameToConfig,
      global_config: globalConfig,
      relativePath: path,
      params: params,
      env: env
    });
  });
});
