const TemplateArgsBuilder = require('../../../src/commands/build/templateargsbuilder');
const path = require('path');

describe('TemplateArgsBuilder builds args for Handlebars Templates properly', () => {
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

  it('will use the default template data formatter when no custom one is given', () => {
    const templateArgsBuilder = new TemplateArgsBuilder(undefined);
    const args = templateArgsBuilder.buildArgs({
      relativePath,
      pageName: 'page1',
      currentLocaleConfig,
      globalConfig,
      locale: 'en',
      pageNameToConfig,
      env
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
    const templateDataFormatterPath = 
      path.resolve(__dirname, '../../fixtures/hooks/templatedataformatter.js');
    const templateArgsBuilder = new TemplateArgsBuilder(templateDataFormatterPath);
    const args = templateArgsBuilder.buildArgs({
      relativePath,
      pageName: 'page2',
      currentLocaleConfig,
      globalConfig,
      locale: 'en',
      pageNameToConfig,
      env
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
