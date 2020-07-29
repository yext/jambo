const globby = require('globby');
const { GettextExtractor, JsExtractors } = require('gettext-extractor');
const xgettextTemplate = require('xgettext-template');
const path = require('path');

/**
 * Extracts i18n strings from .js files to an output file (defaulting to message.pot),
 * then extracts i18n strings from .hbs files and appends to that output file.
 * @param {Array.<string>} options.files specific files extract from e.g. webpack.config.js
 * @param {Array.<string>} options.directories directories to recursively extract from e.g. src
 * @param {Array.<string>} options.ignore paths to recursively ignore e.g. node_modules
 * @param {Object} options.translateMethods the method names to search for
 * @param {string} options.output
 */
module.exports = function (options) {
  const optionsWithDefaulting = {
    files: [],
    directories: [],
    ignore: [],
    output: 'messages.pot',
    ...options,
    translateMethods: {
      translate: 'translate',
      translatePlural: 'translateN',
      translateWithContext: 'translateC',
      translatePluralWithContext: 'translateCN',
      ...options.translateMethods
    }
  };
  extractJsToPot(optionsWithDefaulting);
  appendHbsToPot(optionsWithDefaulting);
}

function extractJsToPot(options) {
  const extractor = new GettextExtractor();
  const {
    translate, translatePlural, translateWithContext, translatePluralWithContext
  } = options.translateMethods;

  const jsParser = extractor.createJsParser([
    JsExtractors.callExpression(translate, {
      arguments: { text: 0 }
    }),
    JsExtractors.callExpression(translatePlural, {
      arguments: { text: 0, textPlural: 1 }
    }),
    JsExtractors.callExpression(translateWithContext, {
      arguments: { text: 0, context: 1 }
    }),
    JsExtractors.callExpression(translatePluralWithContext, {
      arguments: { text: 0, textPlural: 1, context: 2 }
    })
  ]);

  const ignore = options.ignore.map(pathname => {
    return path.extname(pathname) ? pathname : `${pathname}/**/*`
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

function appendHbsToPot(options) {
  const directoryGlobs = options.directories.map(dirpath => `${dirpath}/**/*.hbs`);
  const ignoreGlobs = options.ignore.map(dirpath => `!${dirpath}`);
  const files = options.files.filter(filepath => path.extname(filepath) === '.hbs');
  const input = globby.sync([...directoryGlobs, ...files, ...ignoreGlobs]);
  const {
    translate, translatePlural, translateWithContext, translatePluralWithContext
  } = options.translateMethods;

  /** 
   * Needed because xgettext-template does an if check for the callback,
   * instead of setting it to an empty function if one is not specified.
   * The output .pot file will not be written to if the callback is falsy.
   * @param {Buffer} potContent the .pot file content extracted from the .hbs files
   */
  const necessaryEmptyCallback = potContent => {};
  xgettextTemplate(input, {
    output: options.output,
    keyword:
      `${translate}, ${translatePlural}:1,2, ${translateWithContext}:1,2c, ${translatePluralWithContext}:1,2,3c`,
    'join-existing': true,
    'force-po': true
  }, necessaryEmptyCallback);
}
