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
   * @param {Object<String,String>} pageNameToTemplateContents
   */
  writePages (pageSet) {
    if (!pageSet || pageSet.getPages().length < 1) {
      return;
    }
    console.log(`Writing files for '${pageSet.getLocale()}' locale`);

    for (const page of pageSet.getPages()) {
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
   * @param {String} filePath the path to the page output file
   * @returns {String}
   */
  _calculateRelativePath (filePath) {
    return path.relative(path.dirname(filePath), "");
  }
}
