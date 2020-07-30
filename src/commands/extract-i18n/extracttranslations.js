const globby = require('globby');
const { GettextExtractor, JsExtractors } = require('gettext-extractor');
const xgettextTemplate = require('xgettext-template');
const path = require('path');
const fs = require('fs');

/**
 * Extracts i18n strings from .js files to an output file (defaulting to message.pot),
 * then extracts i18n strings from .hbs files and appends to that output file.
 * @param {Array.<string>} options.files specific files extract from e.g. webpack.config.js
 * @param {Array.<string>} options.directories directories to recursively extract from e.g. src
 * @param {Array.<string>} options.ignore paths to recursively ignore e.g. node_modules
 * @param {Object} options.translateMethods the method names to search for
 * @param {string} options.output
 */
function extractTranslations(options) {
  const optionsWithDefaulting = {
    files: [],
    directories: [],
    ignore: [],
    output: 'messages.pot',
    translateMethods: {
      translate: 'translate',
      translatePlural: 'translateN',
      translateWithContext: 'translateC',
      translatePluralWithContext: 'translateCN',
    },
    ...options,
  };
  extractJsTranslations(optionsWithDefaulting);
  extractHbsTranslations(optionsWithDefaulting);
}
module.exports = extractTranslations;

function extractJsTranslations(options) {
  const extractor = new GettextExtractor();
  const {
    translate, translatePlural, translateWithContext, translatePluralWithContext
  } = options.translateMethods;

  const extractors = [];
  if (translate) {
    translateExtractor = JsExtractors.callExpression(translate, {
      arguments: { text: 0 }
    });
    extractors.push(translateExtractor);
  }

  if (translatePlural) {
    translatePluralExtractor = JsExtractors.callExpression(translatePlural, {
      arguments: { text: 0, textPlural: 1 }
    });
    extractors.push(translatePluralExtractor);
  }

  if (translateWithContext) {
    translateWithContextExtractor = JsExtractors.callExpression(translateWithContext, {
      arguments: { text: 0, context: 1 }
    });
    extractors.push(translateWithContextExtractor);
  }

  if (translatePluralWithContext) {
    translatePluralWithContextExtractor = JsExtractors.callExpression(translatePluralWithContext, {
      arguments: { text: 0, textPlural: 1, context: 2 }
    });
    extractors.push(translatePluralWithContextExtractor);
  }

  const jsParser = extractor.createJsParser(extractors);

  const ignore = options.ignore.map(pathname => {
    const isFile = fs.existsSync(pathname) && fs.lstatSync(pathname).isFile();
    return isFile ? pathname : `${pathname}/**/*`
  });
  options.directories.forEach(dirpath => {
    const directoryGlob = `${dirpath}/**/*.js`;
    jsParser.parseFilesGlob(directoryGlob, { ignore: ignore });
  });

  options.files
    .filter(filepath => path.extname(filepath) === '.js' && !ignore.includes(filepath))
    .forEach(filepath => jsParser.parseFile(filepath));

  extractor.savePotFile(options.output);
}

function extractHbsTranslations(options) {
  const directoryGlobs = options.directories.map(dirpath => `${dirpath}/**/*.hbs`);
  const ignoreGlobs = options.ignore.map(dirpath => `!${dirpath}`);
  const files = options.files.filter(filepath => path.extname(filepath) === '.hbs');
  const input = globby.sync([...directoryGlobs, ...files, ...ignoreGlobs]);
  const {
    translate, translatePlural, translateWithContext, translatePluralWithContext
  } = options.translateMethods;

  /** 
   * The empty callback is needed because xgettext-template does an if check for the callback,
   * and if the callback is not present will not write to the output file.
   */
  xgettextTemplate(input, {
    output: options.output,
    keyword:
      `${translate}, ${translatePlural}:1,2, ${translateWithContext}:1,2c, ${translatePluralWithContext}:1,2,3c`,
    'join-existing': true,
    'force-po': true
  }, () => {});
}
