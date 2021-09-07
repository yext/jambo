import defaultTemplateDataFormatter from './defaulttemplatedataformatter';
import fs from 'fs';
import UserError from '../../errors/usererror';

/**
 * TemplateArgsBuilder is responsible for building the arguments that are
 * sent to the handlebars templates.
 */
export default class TemplateArgsBuilder {
  templateDataFormatterHook: string;

  constructor(templateDataFormatterHook) {
    /**
     * The path to the template data formatter hook.
     * If a file exists at this path, TemplateArgsFormatter will
     * try to use it to format the template arguments.
     *
     * @type {string}
     */
    this.templateDataFormatterHook = templateDataFormatterHook;
  }

  /**
   * Builds the template arguments for a given page.
   *
   * @param {string} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {string} pageName the name of the current page,
   *                          e.g. index for index.html or index.fr.html
   * @param {Object} currentLocaleConfig the chunk of localeConfig for the current locale
   * @param {Object} globalConfig
   * @param {string} locale the locale for the page being built
   * @param {Object} env environment variables
   * @param {Object<string, Object>} pageNameToConfig
   * @returns {Object}
   */
  buildArgs({ relativePath, pageName, currentLocaleConfig, globalConfig, locale, env, pageNameToConfig }: any) {
    const pageMetadata = {
      relativePath,
      pageName
    };
    const siteLevelAttributes = {
      currentLocaleConfig,
      globalConfig,
      locale,
      env
    };
    if (fs.existsSync(this.templateDataFormatterHook)) {
      return this._getTemplateDataFromFormatter(
        pageMetadata, siteLevelAttributes, pageNameToConfig);
    }
    return defaultTemplateDataFormatter(
      pageMetadata, siteLevelAttributes, pageNameToConfig);
  }

  /**
   * Returns the data after applying the template data hook
   * formatter on it.
   *
   * @param {Object} pageMetadata
   * @param {Object} siteLevelAttributes
   * @param {Object<string, Object>} pageNameToConfig
   * @returns {Object}
   */
  _getTemplateDataFromFormatter(pageMetadata: any, siteLevelAttributes: any, pageNameToConfig: Record<string, any>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const formatterFunction = require(this.templateDataFormatterHook);
      return formatterFunction(pageMetadata, siteLevelAttributes, pageNameToConfig);
    } catch (err) {
      const msg =
        `Could not load template data hook from ${this.templateDataFormatterHook}: `;
      throw new UserError(msg, err.stack);
    }
  }
}