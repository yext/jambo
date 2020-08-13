const GlobalConfig = require('../../../src/models/globalconfig');
const GlobalConfigLocalizer = require('../../../src/commands/build/globalconfiglocalizer');
const LocalizationConfig = require('../../../src/models/localizationconfig');

describe('GlobalConfigLocalizer works for sites without a localization config', () => {
  it('does not alter global config when localization config is empty', () => {
    const globalConfig = new GlobalConfig({
      locale: 'es',
      apiKey: 'apiKey',
      experienceKey: 'experienceKey',
    });
    const localizationConfig = new LocalizationConfig();
    const localeToGlobalConfig = new GlobalConfigLocalizer(localizationConfig)
      .localize(globalConfig, globalConfig.getLocale());

    expect(localeToGlobalConfig).toEqual(globalConfig);
  });
});

describe('GlobalConfigLocalizer generates expected localized global configs', () => {
  const globalConfig = new GlobalConfig({
    locale: 'es',
    apiKey: 'apiKeyFromGlobalConfig',
    experienceKey: 'experienceKeyFromGlobalConfig'
  });
  const localizationConfig = new LocalizationConfig({
    localeConfig: {
      en: {
        apiKey: 'en_apiKeyFromLocalizationConfig',
        experienceKey: 'en_experienceKeyFromLocalizationConfig'
      },
      fr: {}
    }
  });

  it('merges global config and localization config correctly', () => {
    const globalConfigLocalizer = new GlobalConfigLocalizer(localizationConfig);

    expect(globalConfigLocalizer.localize(globalConfig, 'en')).toEqual(
      new GlobalConfig({
        locale: 'en',
        apiKey: 'en_apiKeyFromLocalizationConfig',
        experienceKey: 'en_experienceKeyFromLocalizationConfig'
      }));

    expect(globalConfigLocalizer.localize(globalConfig, 'fr')).toEqual(
      new GlobalConfig({
        locale: 'fr',
        apiKey: 'apiKeyFromGlobalConfig',
        experienceKey: 'experienceKeyFromGlobalConfig'
      }));
  });
});
