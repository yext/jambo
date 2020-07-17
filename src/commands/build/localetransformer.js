
exports.LocaleTransformer = class {
  constructor(config) {
    // TODO fallbacks/error behavior if these are missing?
    this.pagesConfig = config.pagesConfig;
    this.globalConfigName = config.globalConfigName;
    this.localeConfigName = config.localeConfigName;

    let localeConfig = config.pagesConfig[config.localeConfigName];
    this.defaultLocale = localeConfig.default || '';
    this.locales = localeConfig.localeConfig || {};

    let urlFormatConfig = localeConfig.urlFormat || {};
    this.defaultUrlFormat = urlFormatConfig.default || '';
    this.baseLocaleFormat = urlFormatConfig.baseLocale || '';
  }

  _transformConfigsForLocale() {
    let thinkOfABetterNameLocales = {}; // TODO naming

    // For each locale, do this
    for (const [locale, configForLocale] of Object.entries(this.locales)) {
      // FORMAT GLOBAL CONFIG FOR LOCALE
      let globalConfigForLocale = Object.assign({},
        this.pagesConfig[this.globalConfigName],
        {
          experienceKey: configForLocale.experienceKey,
          apiKey: configForLocale.apiKey,
        }
      );

      // For each locale fallback, if there is a pageName.[LOCALE].json, ADD/ASSIGN any config
      let pagesConfigsForLocale = { ...this.pagesConfig };
      for (const [configName, pageConfig] of Object.entries(pagesConfigsForLocale)) {
        if (configForLocale.fallback) {
          for (let fallbackLocale of configForLocale.fallback) {
            // MERGE PAGE CONFIG WITH FALLBACK CONFIG
            pagesConfigsForLocale[configName] = this._mergeConfigs(pageConfig, pagesConfigsForLocale[`${configName}.${fallbackLocale}`]);
          }
        }
      }

      // FORMAT PAGE CONFIGS FOR LOCALE
      for (const [configName, pageConfig] of Object.entries(pagesConfigsForLocale)) {
        let pageName = this._getPageName(configName);
        // If there is a pageName.[LOCALE].json instead of just a pageName.json, ADD/ASSIGN any config
        // from the locale specific config for the regular one
        pagesConfigsForLocale[pageName] = this._mergeConfigs(pageConfig, pagesConfigsForLocale[`${configName}.${locale}`]);
      }

      thinkOfABetterNameLocales[locale] = {
        urlFormatter: this.getUrlFormatter(locale, configForLocale.urlOverride),
        verticalConfigs: this._filterExtraConfigs(pagesConfigsForLocale),
        globalConfig: globalConfigForLocale,
        pagesConfig: pagesConfigsForLocale,
        pageParams: configForLocale.params || {},
      };
    }
    return thinkOfABetterNameLocales;
  }

  _getPageName(configName) {
    return configName.substring(0, configName.lastIndexOf(".")) || configName;
  }

  _filterExtraConfigs(allConfigs) {
    return Object.keys(allConfigs).reduce((object, key) => {
      let configNameWithoutLocale = key.substring(0, key.lastIndexOf(".")) || key;
      let keyIsForPage = configNameWithoutLocale !== this.globalConfigName && configNameWithoutLocale !== this.localeConfigName;
      if (keyIsForPage) {
        object[configNameWithoutLocale] = allConfigs[key]; // TODO be smarter about reducing the locales from these
      }
      return object;
    }, {});
  }

  getUrlFormatter(locale, urlOverride) {
    let language = locale.substring(0, locale.lastIndexOf("-")) || locale;
    let basicUrlPattern = locale === this.defaultLocale ? this.baseLocaleFormat : this.defaultUrlFormat;
    let urlPattern = urlOverride || basicUrlPattern;
    return (pageName, pageExt) => {
      return urlPattern
        .replace('{language}', language)
        .replace('{locale}', locale)
        .replace('{pageName}', pageName)
        .replace('{pageExt}', pageExt);
    };
  }

  _mergeConfigs(config1, config2) {
    if (!config1) {
      return Object.assign({}, config2);
    }
    if (!config2) {
      return Object.assign({}, config1);
    }
    return Object.assign({},
      config1,
      config2);
  }
}