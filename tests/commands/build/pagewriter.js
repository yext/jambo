const PageWriter = require('../../../src/commands/build/pagewriter');
const path = require('path');

describe('PageWriter builds args for Handlebars Templates properly', () => {
  const env = {
    envVar: 'envVar',
  };
  const pageConfig = {
    pageConfigParam: 'param',
  };
  const relativePath = 'relativePath';
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

  it('builds args as expected when all are present', () => {
    const args = new PageWriter({
      env: env
    })._buildArgsForTemplate({
      pageConfig,
      params,
      relativePath,
      globalConfig,
      pageNameToConfig
    });

    expect(args).toEqual({
      ...pageConfig,
      verticalConfigs: pageNameToConfig,
      global_config: globalConfig,
      relativePath,
      params,
      env
    });
  });

  it('can use the templatedata hook in the theme for custom args', () => {
    const args = new PageWriter({
      env: env,
      templateDataHookPath:
        path.resolve(__dirname, '../../fixtures/hooks/templatedata.js')
    })._buildArgsForTemplate({
      pageConfig,
      params,
      relativePath,
      globalConfig,
      pageNameToConfig
    });

    expect(args).toEqual({
      aPageConfig: pageConfig,
      aRelativePath: relativePath,
      aParams: params,
      aGlobalConfig: globalConfig,
      aPageNameToConfig: pageNameToConfig,
      anEnv: env
    });
  });
});
