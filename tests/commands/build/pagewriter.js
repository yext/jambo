const PageWriter = require('../../../src/commands/build/pagewriter');
const path = require('path');

describe('PageWriter builds args for Handlebars Templates properly', () => {
  const env = {
    envVar: 'envVar',
  };
  const relativePath = '..';
  const currentLocaleConfig = {
    experienceKey: 'experienceKey',
    params: {
      example: 'param'
    },
    urlOverride: '{pageName}',
    translationFile: 'path/to/file.po',
    fallback: ['es']
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
      relativePath,
      currentLocaleConfig,
      globalConfig,
      pageNameToConfig,
      locale: 'en',
      pageName: 'page1'
    });

    expect(args).toEqual({
      ...pageNameToConfig.page1,
      verticalConfigs: pageNameToConfig,
      global_config: {
        apiKey: 'apiKey',
        experienceKey: 'experienceKey',
        locale: 'en'
      },
      relativePath: '..',
      params: {
        example: 'param'
      },
      env
    });
  });

  it('can use the templatedata hook in the theme for custom args', () => {
    const args = new PageWriter({
      env: env,
      templateDataFormatter:
        path.resolve(__dirname, '../../fixtures/hooks/templatedataformatter.js')
    })._buildArgsForTemplate({
      relativePath,
      pageName: 'page2',
      globalConfig,
      currentLocaleConfig,
      locale: 'en',
      pageNameToConfig
    });

    const pageMetadata = {
      relativePath,
      pageName: 'page2'
    };

    const siteLevelAttributes = {
      globalConfig,
      currentLocaleConfig,
      locale: 'en',
      env: env
    };

    expect(args).toEqual({
      aPageMetadata: pageMetadata,
      someSiteLevelAttributes: siteLevelAttributes,
      aPageNameToConfig: pageNameToConfig
    });
  });
});
