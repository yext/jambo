const { PageWriter } = require('../../src/commands/build/pagewriter');

describe('buildArgsForTemplate', () => {
  it('builds args for template as expected when all are present', () => {
    const env = {
      envVar: 'testing',
    };
    const pageConfig = {
      pageConfigParam: 'hello',
    };
    const path = '';
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
      path: path,
      params: params,
      globalConfig: globalConfig,
      pageNameToConfig: pageNameToConfig
    });

    expect(args).toEqual({
      ...pageConfig,
      verticalConfigs: pageNameToConfig,
      global_config: globalConfig,
      relativePath: '',
      params: params,
      env: env
    });
  });
});
