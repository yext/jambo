const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');

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
  }

  /**
   * Writes a file to the output directory per page in the given PageSet.
   *
   * @param {PageSet} pageSet the collection of pages to generate
   */
  writePages (pageSet) {
    if (!pageSet || pageSet.getPages().length < 1) {
      return;
    }
    console.log(`Writing files for '${pageSet.getLocale()}' locale`);

    for (const page of pageSet.getPages()) {
      if (!page.getConfig()) {
        throw new Error(`Error: No config found for page: ${page.getPageName()}`);
      }
      if (!page.getTemplatePath()) {
        throw new Error(`Error: No template found for page: ${page.getPageName()}`);
      }

      console.log(`Writing output file for the '${page.getPageName()}' page`);
      const templateArguments = this._buildArgsForTemplate({
        pageConfig: page.getConfig(),
        path: this._calculateRelativePath(page.getOutputPath()),
        params: pageSet.getParams(),
        globalConfig: pageSet.getGlobalConfig().getConfig(),
        pageNameToConfig: pageSet.getPageNameToConfig(),
      });
      const template = this._getHandlebarsTemplate(page.getTemplatePath());
      const outputHTML = template(templateArguments);

      fs.writeFileSync(
        `${this._outputDirectory}/${page.getOutputPath()}`,
        outputHTML
      );
    }
  }

  /**
   * Gets the Handlebars template for a given path
   *
   * @param {String} path the path to the page handlebars template
   * @returns {HandlebarsTemplateDelegate<T>}
   */
  _getHandlebarsTemplate (path) {
    return hbs.compile(fs.readFileSync(path).toString());
  }

  /**
   * Creates the Object that will be passed in as arguments to the templates
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {String} relativePath
   * @param {String} params
   * @param {Object} globalConfig
   * @param {Object} pageNameToConfig
   * @returns {Object}
   */
  _buildArgsForTemplate ({ pageConfig, relativePath, params, globalConfig, pageNameToConfig }) {
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
   * Calculates the path from the page output file to the root output directory.
   *
   * @param {String} path the path to the page output file
   * @returns {String}
   */
  _calculateRelativePath (filePath) {
    return path.relative(path.dirname(filePath), "");;
  }
}
