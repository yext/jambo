const { Configs } = require('../../src/models/configs');
const { LocalizationConfig } = require('../../src/models/localizationconfig');
const { PageConfig } = require('../../src/models/pageconfig');
const { getPageName } = require('../../src/utils/fileutils');

describe('creates global config objects properly', () => {
  it('uses url formatter function and parses extension correctly from templatePath', () => {
    const globalConfig = {
      test: 'config'
    };
    const configs = new Configs({
      global_config: globalConfig
    });
    expect(configs.getGlobalConfig()).toEqual(globalConfig);
  });
});


describe('creates localization config properly', () => {
  it('creates properly when present', () => {
    const localizationConfig = {
      defaultLocale: 'en'
    };
    const configs = new Configs({
      global_config: {},
      locale_config: localizationConfig
    });

    expect(configs.getLocalizationConfig())
      .toEqual(new LocalizationConfig(localizationConfig));
  });

  it('creates properly when absent', () => {
    const configs = new Configs({
      global_config: {},
    });

    expect(configs.getLocalizationConfig())
      .toEqual(new LocalizationConfig());
  });
});

describe('creates pageConfigs properly', () => {
  const configNameWithLocale = 'configName.es';
  const configName = 'configName';
  const pageConfig = {
    verticalKey: 'KM'
  };
  const rawConfigs = {
    global_config: {},
    locale_config: {}
  };
  rawConfigs[configName] = pageConfig;
  rawConfigs[configNameWithLocale] = pageConfig;

  it('creates properly with locale', () => {
    const rawConfigsCopy = { ...rawConfigs };
    const configs = new Configs(rawConfigs);

    expect(configs.getPageConfigs())
      .toEqual([
        new PageConfig({
          pageName: getPageName(configName),
          locale: configs._parseLocale(configName),
          rawConfig: pageConfig
        }),
        new PageConfig({
          pageName: getPageName(configNameWithLocale),
          locale: configs._parseLocale(configNameWithLocale),
          rawConfig: pageConfig
        })
    ]);
    expect(rawConfigs).toEqual(rawConfigsCopy);
  });
});

describe('parses locale from config name', () => {
  const configs = new Configs({
    global_config: {},
    locale_config: {}
  });

  it('parses locale when none exists', () => {
    expect(configs._parseLocale('configWithNoLocale')).toEqual(false);
  });

  it('parses locale when present', () => {
    const locale = 'en';
    expect(configs._parseLocale(`config.${locale}`)).toEqual(locale);
  });
});