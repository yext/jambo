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
        verticalConfigs : verticalConfigs,
        global_config : global_config,
        params : params,
        relativePath: relativePath,
        env: env
    };

    const isValid = new TemplateDataValidator(templateDataValidationHook).validate({
        pageName: 'examplePage',
        pageData: templateData
    });
    expect(isValid).toEqual(true);
  });

  it('throws an error when a field in config is missing', () => {
    const templateDataValidationHook = path.resolve(
        __dirname, '../../fixtures/hooks/templatedatavalidator.js');
    const global_config_missing_key = {};
    const templateData = {
        currentPageConfig,
        verticalConfigs : verticalConfigs,
        global_config : global_config_missing_key,
        params : params,
        relativePath: relativePath,
        env: env
    }; 

    const isValid = new TemplateDataValidator(templateDataValidationHook).validate({
        pageName: 'examplePage',
        pageData: templateData
    });
    expect(isValid).toEqual(false);

  });


  it('does not throw error, gracefully ignore missing config field in bad pages', () => {
    const templateDataValidationHook = path.resolve(
        __dirname, '../../fixtures/hooks/templatedatavalidator.js');
    const params_missing_field = {};
    const templateData = {
        currentPageConfig,
        verticalConfigs : verticalConfigs,
        global_config : global_config,
        params : params_missing_field,
        relativePath: relativePath,
        env: env
    };

    const isValid = new TemplateDataValidator(templateDataValidationHook).validate({
        pageName: 'examplePage',
        pageData: templateData
    });
    expect(isValid).toEqual(true);
  });

});
