const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');

/**
 * Writes output files for the specified pages.
 */
module.exports = class PageWriter {
  constructor(config) {
    this.env = config.env;

    this.partialsDirectory = config.partialsDirectory;
    this.outputDirectory = config.outputDirectory;
  }

  /**
   * Writes a file to the output directory per page in the given pageSet
   *
   * @param {PageSet} pageSet the collection of pages to generate
   */
  writePages (pageSet) {
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
        path: page.getOutputPath(),
        params: pageSet.getParams(),
        globalConfig: pageSet.getGlobalConfig(),
        pageNameToConfig: pageSet.getPageNameToConfig(),
      });
      const template = this._getHandlebarsTemplate(page.getTemplatePath());
      const outputHTML = template(templateArguments);

      fs.writeFileSync(
        `${this.outputDirectory}/${page.getOutputPath()}`,
        outputHTML
      );
    }
  }

  /**
   * Gets the page template for a given path
   *
   * @param {String} path the path to the page handlebars template
   * @returns {HandlebarsTemplateDelegate<T>}
   */
  _getHandlebarsTemplate (path) {
    return hbs.compile(fs.readFileSync(path).toString());
  }

  /**
   * Merges the configuration to make the arguments for the templates
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {String} path the path to the page handlebars template
   * @param {String} params
   * @param {Object} globalConfig
   * @param {Object} pageNameToConfig
   * @returns {Object}
   */
  _buildArgsForTemplate ({ pageConfig, path, params, globalConfig, pageNameToConfig }) {
    return Object.assign(
      {},
      pageConfig,
      {
        verticalConfigs: pageNameToConfig,
        global_config: globalConfig,
        relativePath: this._calculateRelativePath(path),
        params: params,
        env: this.env
     }
    );
  }

  _calculateRelativePath (filePath) {
    return path.relative(path.dirname(filePath), "");;
  }
}
