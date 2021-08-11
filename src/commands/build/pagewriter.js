const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

const PageSet = require('../../models/pageset');
const UserError = require('../../errors/usererror');
const { NO_LOCALE } = require('../../constants');
const LocalizationConfig = require('../../models/localizationconfig');
const TemplateArgsBuilder = require('./templateargsbuilder');
const TemplateDataValidator = require('./templatedatavalidator');
const { info } = require('../../utils/logger');

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
     * @type {TemplateArgsBuilder}
     */
    this._templateArgsBuilder =
      new TemplateArgsBuilder(config.templateDataFormatterHook);

    /**
     * @type {TemplateDataValidator}
     */
    this._templateDataValidator =
      new TemplateDataValidator(config.templateDataValidationHook);
  }

  /**
   * Writes a file to the output directory per page in the given PageSet.
   *
   * @param {PageSet} pageSet the collection of pages to generate
   * @throws {UserError} on missing page config(s), validation hook execution 
   * failure, and invalid template data using Theme's validation hook
   */
  writePages(pageSet) {
    if (!pageSet || pageSet.getPages().length < 1) {
      return;
    }
    const localeMessage = pageSet.getLocale() !== NO_LOCALE
      ? ` for '${pageSet.getLocale()}' locale`
      : '';
    info(`Writing files${localeMessage}`);

    for (const page of pageSet.getPages()) {
      if (!page.getConfig()) {
        throw new UserError(`Error: No config found for page: ${page.getName()}`);
      }

      const templateArguments = this._templateArgsBuilder.buildArgs({
        relativePath: this._calculateRelativePath(page.getOutputPath()),
        pageName: page.getName(),
        currentLocaleConfig: pageSet.getCurrentLocaleConfig(),
        globalConfig: pageSet.getGlobalConfig().getConfig(),
        pageNameToConfig: pageSet.getPageNameToConfig(),
        locale: pageSet.getLocale(),
        env: this._env
      });
      
      if(!this._templateDataValidator.validate({
        pageName: page.getName(),
        pageData: templateArguments,
        partials: hbs.partials
      })) {
        throw new UserError('Invalid page template configuration(s).');
      }

      info(`Writing output file for the '${page.getName()}' page`);
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
