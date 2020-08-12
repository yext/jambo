const ConfigurationRegistry = require('../../src/models/configurationregistry');
const { getPageName } = require('../../src/utils/fileutils');
const GlobalConfig = require('../../src/models/globalconfig');
const LocalizationConfig = require('../../src/models/localizationconfig');
const PageConfig = require('../../src/models/pageconfig');

describe('ConfigurationRegistry forms object properly using static frm', () => {
  it('creates GlobalConfig object properly', () => {
    const rawGlobalConfig = {
      test: 'config'
    };
    const configRegistry = ConfigurationRegistry.from({
      global_config: rawGlobalConfig,
      locale_config: new LocalizationConfig()
    });
    expect(configRegistry.getGlobalConfig())
      .toEqual(new GlobalConfig(rawGlobalConfig));
  });

  it('creates LocalizationConfig properly when locale_config is present', () => {
    const localizationConfig = {
      defaultLocale: 'en'
    };
    const configRegistry = ConfigurationRegistry.from({
      global_config: {},
      locale_config: localizationConfig
    });

    expect(configRegistry.getLocalizationConfig())
      .toEqual(new LocalizationConfig(localizationConfig));
  });

  it('creates LocalizationConfig properly when locale_config is absent', () => {
    const configRegistry = ConfigurationRegistry.from({
      global_config: {},
    });

    expect(configRegistry.getLocalizationConfig())
      .toEqual(new LocalizationConfig());
  });

  it('creates PageConfigs properly', () => {
    const configName = 'configName';
    const configNameWithLocale = `${configName}.es`;
    const rawPageConfig = {
      verticalKey: 'KM'
    };
    const rawConfigs = {
      global_config: {},
      locale_config: {}
    };
    rawConfigs[configName] = rawPageConfig;
    rawConfigs[configNameWithLocale] = rawPageConfig;
    const rawConfigsCopy = { ...rawConfigs };
    const configRegistry = ConfigurationRegistry.from(rawConfigs);

    expect(configRegistry.getPageConfigs())
      .toEqual([
        new PageConfig({
          pageName: getPageName(configName),
          locale: ConfigurationRegistry._parseLocale(configName),
          rawConfig: rawPageConfig
        }),
        new PageConfig({
          pageName: getPageName(configNameWithLocale),
          locale: ConfigurationRegistry._parseLocale(configNameWithLocale),
          rawConfig: rawPageConfig
        })
      ]);
    expect(rawConfigs).toEqual(rawConfigsCopy);
  });
});

describe('ConfigurationRegistry parses locale from config name', () => {
  it('parses locale when none exists', () => {
    expect(ConfigurationRegistry._parseLocale('configWithNoLocale')).toEqual(false);
  });

  it('parses locale when present', () => {
    const locale = 'en';
    expect(ConfigurationRegistry._parseLocale(`test.${locale}`)).toEqual(locale);
  });
});