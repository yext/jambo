const TemplateDataValidator = require('../../../src/commands/build/templatedatavalidator');
const path = require('path');
const UserError = require('../../../src/errors/usererror');

describe('TemplateDataValidator validates config data using hook properly', () => {
  const currentPageConfig = {
    url: 'examplePage.html',
    verticalKey: 'examplePage',
    pageTitle: 'Example Page',
    pageSettings: { search: { verticalKey: 'examplePage', defaultInitialSearch: '' } },
    componentSettings: {
      prop: 'example1',
    }, 
    verticalsToConfig: {
      examplePage: {
        prop: 'example2'
      }
    }
  };
  const verticalConfigs = {
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
  const global_config = {
    sdkVersion: 'X.X',
    apiKey: 'exampleKey',
    experienceKey: 'slanswers',
    locale: 'en'
  };
  const params = {
    example: 'param'
  };
  const relativePath = '..';
  const env = {
    envVar: 'envVar',
  };

  it('does not throw an error with a correct config', () => {
    const templateDataValidationHook = path.resolve(
        __dirname, '../../fixtures/hooks/templatedatavalidator.js');
    const templateData = {
        currentPageConfig,
        verticalConfigs,
        global_config,
        params,
        relativePath,
        env
    };

    expect(() => new TemplateDataValidator(templateDataValidationHook).validate({
        pageName: 'examplePage',
        pageData: templateData
    })).not.toThrow(UserError);
  });

  it('throws an error when a field in config is missing', () => {
    const templateDataValidationHook = path.resolve(
        __dirname, '../../fixtures/hooks/templatedatavalidator.js');
    const global_config_missing_key = {};
    const templateData = {
        currentPageConfig,
        verticalConfigs,
        global_config_missing_key,
        params,
        relativePath,
        env
    };  

    expect(() => new TemplateDataValidator(templateDataValidationHook).validate({
        pageName: 'examplePage',
        pageData: templateData
    })).toThrow(UserError);

  });
});
