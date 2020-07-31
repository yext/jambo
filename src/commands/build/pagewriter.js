const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');
const { VerticalConfigs } = require('../../models/verticalconfigs');

/**
 * Writes output files for the specified pages.
 */
exports.PageWriter = class {
  constructor(config) {
    this.globalConfig = config.globalConfig;
    this.params = config.params;
    this.env = config.env;

    this.partialsDirectory = config.partialsDirectory;
    this.outputDirectory = config.outputDirectory;
  }

  /**
   * Writes a file to the output directory per config passed in
   * @param {VerticalConfigs} configs the collection of configs to generate pages for
   */
  writePages(configs) {
    for (const [pageId, pageConfig] of Object.entries(configs)) {
      if (!pageConfig) {
        throw new Error(`Error: No config found for page: ${pageId}`);
      }
      if (!pageConfig.templatePath) {
        throw new Error(`Error: No url found for page: ${pageId}`);
      }

      console.log(`Writing output file for the '${pageId}' page`);

      const path = pageConfig.templatePath;
      delete pageConfig.templatePath;

      const templateArguments = this._buildArgsForTemplate(pageConfig, path);
      const template = this._getHandlebarsTemplate(path);
      const outputHTML = template(templateArguments);

      fs.writeFileSync(
        `${this.outputDirectory}/${pageConfig.url}`,
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
  _getHandlebarsTemplate(path) {
    return hbs.compile(fs.readFileSync(path).toString());
  }

  /**
   * Merges the configuration to make the arguments for the templates
   *
   * @param {Object} pageConfig the configuration for the current page
   * @param {string} path the path to the page handlebars template
   * @returns {Object}
   */
  _buildArgsForTemplate(pageConfig, path) {
    return Object.assign(
      {},
      this.params || {},
      pageConfig,
      {
        verticalConfigs: this.verticalConfigs,
        global_config: this.globalConfig,
        relativePath: this._calculateRelativePath(path),
        env: this.env
     }
    );
  }

  _calculateRelativePath(filePath) {
    return path.relative(filePath, '');
  }
}
