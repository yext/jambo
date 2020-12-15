const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');
const UserError = require('../../errors/usererror');
const { NO_LOCALE } = require('../../constants');

/**
 * PageWriter is responsible for writing output files for the given {@link PageSet} to
 * the given output directory.
 */
module.exports = class PageWriter {
  constructor(config) {
    /**
     * @type {Object}
     */
    this._env = config.env;

    /**
     * @type {String}
     */
    this._outputDirectory = config.outputDirectory;

    /**
     * Absolute path to the template data hook, if one is given.
     * 
     * @type {String|undefined}
     */
    this._templateDataHookPath = config.templateDataHookPath;
  }

  /**
   * Writes a file to the output directory per page in the given PageSet.
   *
   * @param {PageSet} pageSet the collection of pages to generate
   */
  writePages(pageSet) {
    if (!pageSet || pageSet.getPages().length < 1) {
      return;
    }
    const localeMessage = pageSet.getLocale() !== NO_LOCALE
      ? ` for '${pageSet.getLocale()}' locale`
      : '';
    console.log(`Writing files${localeMessage}`);

    for (const page of pageSet.getPages()) {
      if (!page.getConfig()) {
        throw new UserError(`Error: No config found for page: ${page.getName()}`);
      }

      console.log(`Writing output file for the '${page.getName()}' page`);
      const templateArguments = this._buildArgsForTemplate({
        pageConfig: page.getConfig(),
        relativePath: this._calculateRelativePath(page.getOutputPath()),
        params: pageSet.getParams(),
        globalConfig: pageSet.getGlobalConfig().getConfig(),
        pageNameToConfig: pageSet.getPageNameToConfig(),
      });

      const template = hbs.compile(page.getTemplateContents());
      const outputHTML = template(templateArguments);

      fs.writeFileSync(
        `${this._outputDirectory}/${page.getOutputPath()}`,
        outputHTML
      );
    }
  }

  /**
   * Creates the Object that will be passed in as arguments to the templates
   * note: verticalConfigs is deprecated and will be removed in the next
   * major jambo version.
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {String} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {Object} params the params object in config for the current locale
   * @param {Object} globalConfig
   * @param {Object} pageNameToConfig
   * @returns {Object}
   */
  _buildArgsForTemplate(
    { pageConfig, relativePath, params, globalConfig, pageNameToConfig }
  ) {
    const hookArgs = {
      pageConfig, relativePath, params, globalConfig, pageNameToConfig
    };
    if (this._templateDataHookPath && fs.existsSync(this._templateDataHookPath)) {
      return this._getTemplateDataFromHook(hookArgs);
    }
    return Object.assign(
      {},
      pageConfig,
      {
        verticalConfigs: pageNameToConfig,
        global_config: globalConfig,
        relativePath: relativePath,
        params: params,
        env: this._env
      }
    );
  }

  /**
   * Returns the data after performing the given template data hook 
   * transformation on it.
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {String} relativePath the relativePath from page to the static assets,
   *                              e.g. ".", "..", "../.."
   * @param {Object} params the params object in config for the current locale
   * @param {Object} globalConfig
   * @param {Object} pageNameToConfig
   * @returns {Object} the additional params to add to the template data
   */
  _getTemplateDataFromHook(
    { pageConfig, relativePath, params, globalConfig, pageNameToConfig }
  ) {
    try {
      const hookFunction = require(this._templateDataHookPath);
      const hookArgs = {
        env: this._env,
        globalConfig: globalConfig,
        pageConfig,
        pageNameToConfig,
        relativePath,
        params
      }
      return hookFunction(hookArgs);
    } catch (err) {
      const msg = `Could not load template data hook from ${this._templateDataHookPath}:`;
      throw new UserError(msg, err.stack);
    }
  }

  /**
   * Calculates the path from the page output file to the root output directory.
   *
   * @param {String} filePath the path to the page output file
   * @returns {String}
   */
  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), '') || '.';
  }
}
