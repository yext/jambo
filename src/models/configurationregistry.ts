import { getPageName } from '../utils/fileutils';
import { parseLocale } from '../utils/configutils';
import GlobalConfig from './globalconfig';
import LocalizationConfig from './localizationconfig';
import PageConfig from './pageconfig';
import { FileNames, ConfigKeys } from '../constants';
import RawConfigValidator from '../validation/rawconfigvalidator';
import { info } from '../utils/logger';

/**
 * ConfigurationRegistry is a registry of the configuration files provided to Jambo.
 *
 * This class does not mutate or localize the configuration in any way.
 */
export default class ConfigurationRegistry {
  private _globalConfig: GlobalConfig;
  private _localizationConfig: LocalizationConfig;
  private _pageConfigs: PageConfig[];

  /**
   * @param {GlobalConfig} globalConfig
   * @param {LocalizationConfig} localizationConfig
   * @param {Array<PageConfig>} pageConfigs
   */
  constructor({ globalConfig, localizationConfig, pageConfigs }: any) {
    /**
     * @type {GlobalConfig}
     */
    this._globalConfig = globalConfig;

    /**
     * @type {LocalizationConfig}
     */
    this._localizationConfig = localizationConfig;

    /**
     * @type {Array<PageConfig>}
     */
    this._pageConfigs = pageConfigs;
  }

  /**
   * Returns the global config
   *
   * @returns {GlobalConfig} global config
   */
  getGlobalConfig() {
    return this._globalConfig;
  }

  /**
   * Returns the localization config
   *
   * @returns {LocalizationConfig} localization config
   */
  getLocalizationConfig() {
    return this._localizationConfig;
  }

  /**
   * Returns the page configs
   *
   * @returns {Array<PageConfig>} page configs
   */
  getPageConfigs() {
    return this._pageConfigs;
  }

  /**
   * Performs validation on the raw configuration files
   *
   * @param {Object<String, Object>} configNameToRawConfig
   * @throws {UserError} Thrown if validation fails
   */
  static validate(configNameToRawConfig: Record<string, any>) {
    new RawConfigValidator(configNameToRawConfig).validate();
  }

  /**
   * Creates @type {ConfigurationRegistry} from the raw configuration objects.
   * This method converts the raw configuration objects into domain models that the
   * ConfigurationRegistry understands, but it does not mutate or localize the
   * configuration in any way.
   *
   * @param {Object<String, Object>} configNameToRawConfig
   * @returns {ConfigurationRegistry}
   * @throws {UserError} Thrown if configNameToRawConfig is invalid
   */
  static from(configNameToRawConfig: Record<string, any>) {
    this.validate(configNameToRawConfig);

    const rawGlobalConfig = configNameToRawConfig[ConfigKeys.GLOBAL_CONFIG];
    const rawLocaleConfig = configNameToRawConfig[ConfigKeys.LOCALE_CONFIG];

    if (!rawLocaleConfig) {
      info(
        `Cannot find '${FileNames.LOCALE_CONFIG}', using locale information ` +
        `from ${FileNames.GLOBAL_CONFIG}.`);
    }
    const localizationConfig = new LocalizationConfig(rawLocaleConfig);

    const pageConfigs = Object.keys(configNameToRawConfig)
      .map((configName) => {
        if (configName !== ConfigKeys.GLOBAL_CONFIG
            && configName !== ConfigKeys.LOCALE_CONFIG) {
          const pageName = localizationConfig.hasConfig()
            ? getPageName(configName)
            : configName;
          const locale = localizationConfig.hasConfig() && parseLocale(configName);
          return new PageConfig({
            pageName: pageName,
            locale: locale,
            rawConfig: configNameToRawConfig[configName]
          });
        }
      })
      .filter(value => value);

    return new ConfigurationRegistry({
      globalConfig: new GlobalConfig(rawGlobalConfig),
      localizationConfig: localizationConfig,
      pageConfigs: pageConfigs,
    });
  }
}