const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');
const UserError = require('../../errors/usererror');
const { NO_LOCALE } = require('../../constants');
const LocalizationConfig = require('../../models/localizationconfig');
const TemplateArgsFormatter = require('./templateargsformatter');

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
     * @type {TemplateArgsFormatter}
     */
    this._templateArgsFormatter =
      new TemplateArgsFormatter(config.templateDataFormatterHook);
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
      const templateArguments = this._templateArgsFormatter.formatArgs({
        relativePath: this._calculateRelativePath(page.getOutputPath()),
        pageName: page.getName(),
        currentLocaleConfig: pageSet.getCurrentLocaleConfig(),
        globalConfig: pageSet.getGlobalConfig().getConfig(),
        pageNameToConfig: pageSet.getPageNameToConfig(),
        locale: pageSet.getLocale(),
        env: this._env
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
   * Calculates the path from the page output file to the root output directory.
   *
   * @param {String} filePath the path to the page output file
   * @returns {String}
   */
  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), '') || '.';
  }
}
