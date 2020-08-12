const GlobalConfig = require('../../../src/models/globalconfig');
const GlobalConfigLocalizer = require('../../../src/commands/build/globalconfiglocalizer');
const LocalizationConfig = require('../../../src/models/localizationconfig');

describe('GlobalConfigLocalizer works for sites without a localization config', () => {
  it('creates localized global config when localization config is empty', () => {
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
      es: {
        apiKey: 'es_apiKeyFromLocalizationConfig',
      },
      de: {
        experienceKey: 'de_experienceKeyFromLocalizationConfig'
      },
      fr: {}
    }
  });

  it('uses localized values if provided in localization config', () => {
    const localeToGlobalConfig = new GlobalConfigLocalizer(localizationConfig)
      .localize(globalConfig, 'en');

    expect(localeToGlobalConfig).toEqual(
      new GlobalConfig({
        locale: 'en',
        apiKey: 'en_apiKeyFromLocalizationConfig',
        experienceKey: 'en_experienceKeyFromLocalizationConfig'
      }));
  });

  it('merges global config and localization config', () => {
    const localeToGlobalConfig = new GlobalConfigLocalizer(localizationConfig)
      .localize(globalConfig, 'es');

    expect(localeToGlobalConfig).toEqual(
      new GlobalConfig({
        locale: 'es',
        apiKey: 'es_apiKeyFromLocalizationConfig',
        experienceKey: 'experienceKeyFromGlobalConfig'
      }));

    const localeToGlobalConfig2 = new GlobalConfigLocalizer(localizationConfig)
      .localize(globalConfig, 'de');

    expect(localeToGlobalConfig2).toEqual(
      new GlobalConfig({
        locale: 'de',
        apiKey: 'apiKeyFromGlobalConfig',
        experienceKey: 'de_experienceKeyFromLocalizationConfig'
      }));
  });

  it('uses values from global config if absent in localization config', () => {
    const localeToGlobalConfig = new GlobalConfigLocalizer(localizationConfig)
      .localize(globalConfig, 'fr');

    expect(localeToGlobalConfig).toEqual(
      new GlobalConfig({
        locale: 'fr',
        apiKey: 'apiKeyFromGlobalConfig',
        experienceKey: 'experienceKeyFromGlobalConfig'
      }));
  });
});
