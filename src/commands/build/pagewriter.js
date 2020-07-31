const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');
const { PageSet } = require('../../models/pageset');

/**
 * Writes output files for the specified pages.
 */
exports.PageWriter = class {
  constructor(config) {
    this.globalConfig = config.globalConfig;
    this.pageIdToConfig = config.pageIdToConfig;
    this.params = config.params;
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
        throw new Error(`Error: No config found for page: ${page.getPageId()}`);
      }
      if (!page.getTemplatePath()) {
        throw new Error(`Error: No template found for page: ${page.getPageId()}`);
      }

      console.log(`Writing output file for the '${page.getPageId()}' page`);
      const templateArguments = this._buildArgsForTemplate(
        page.getConfig(),
        page.getOutputPath()
      );
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
   * @param {string} path the path to the page handlebars template
   * @returns {HandlebarsTemplateDelegate<T>}
   */
  _getHandlebarsTemplate (path) {
    return hbs.compile(fs.readFileSync(path).toString());
  }

  /**
   * Merges the configuration to make the arguments for the templates
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {string} path the path to the page handlebars template
   * @returns {Object}
   */
  _buildArgsForTemplate (pageConfig, path) {
    return Object.assign(
      {},
      this.params || {},
      pageConfig,
      {
        verticalConfigs: this.pageIdToConfig,
        global_config: this.globalConfig,
        relativePath: this._calculateRelativePath(path),
        env: this.env
     }
    );
  }

  _calculateRelativePath (filePath) {
    return path.relative(path.dirname(filePath), "");;
  }
}
