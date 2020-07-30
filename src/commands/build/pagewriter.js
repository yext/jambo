const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

/**
 * Writes output files for the specified pages.
 */
exports.PageWriter = class {
  constructor(config) {
    this.verticalConfigs = config.verticalConfigs;
    this.globalConfig = config.globalConfig;
    this.params = config.params;
    this.env = config.env;

    this.partialsDirectory = config.partialsDirectory;
    this.outputDirectory = config.outputDirectory;
  }

  /**s
   * Writes a file to the output directory per entry in this.verticalConfigs.
   */
  writePages() {
    for (const [pageId, pageConfig] of Object.entries(this.verticalConfigs)) {
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
      const template = this._getHandlebarsTemplate(templateArguments.layout, path);
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
   * @param {string} pageLayout the path to the pageLayout
   * @param {string} path the path to the page handlebars template
   * @returns {HandlebarsTemplateDelegate<T>}
   */
  _getHandlebarsTemplate(pageLayout, path) {
    if (!pageLayout) {
      return hbs.compile(fs.readFileSync(path).toString());
    }

    // TODO do we ever hit this and what does it do??
    hbs.registerPartial('body', fs.readFileSync(path).toString());
    const layoutPath = `${this.partialsDirectory}/${pageLayout}`;
    return hbs.compile(fs.readFileSync(layoutPath).toString());
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
