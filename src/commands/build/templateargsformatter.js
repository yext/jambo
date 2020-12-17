const defaultTemplateDataFormatter = require('./defaulttemplatedataformatter');
const fs = require('fs');

/**
 * TemplateArgsFormatter is responsible for building the arguments that are
 * sent to the handlebars templates.
 */
module.exports = class TemplateArgsFormatter {
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
   * Formats the template arguments for a given page
   * 
   * @param {string} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {string} pageName the name of the current page,
   *                          e.g. index for index.html or index.fr.html
   * @param {Object} currentLocaleConfig the chunk of localeConfig for the current locale
   * @param {Object} globalConfig
   * @param {string} locale the locale for the page being built
   * @param {Object<string, Object>} pageNameToConfig
   * @param {Object} env environment variables
   * @returns {Object}
   */
  formatArgs({
    relativePath,
    pageName,
    currentLocaleConfig,
    globalConfig,
    locale,
    pageNameToConfig,
    env
  }) {
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
   * Returns the data after performing the given template data hook 
   * transformation on it.
   *
   * @param {Object} pageMetadata
   * @param {Object} siteLevelAttributes
   * @param {Object<string, Object>} pageNameToConfig
   */
  _getTemplateDataFromFormatter(pageMetadata, siteLevelAttributes, pageNameToConfig) {
    try {
      const formatterFunction = require(this.templateDataFormatterHook);
      return formatterFunction(pageMetadata, siteLevelAttributes, pageNameToConfig);
    } catch (err) {
      const msg =
        `Could not load template data hook from ${this._templateDataFormatter}: `;
      throw new UserError(msg, err.stack);
    }
  }
}