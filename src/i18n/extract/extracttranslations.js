const globby = require('globby');
const xgettextTemplate = require('xgettext-template');

/**
 * Extracts i18n strings from files with the designated extensions to an output file.
 * @param {Array.<string>} options.files specific files extract from e.g. webpack.config.js
 * @param {Array.<string>} options.directories directories to recursively extract from e.g. src
 * @param {Array.<string>} options.ignore paths to recursively ignore e.g. node_modules
 * @param {Object} options.translateMethods the method names to search for
 * @param {string} options.output
 * @returns {Promise}
 */
function extractTranslations(options) {
  const optionsWithDefaulting = {
    files: [],
    directories: [],
    ignore: [],
    output: 'messages.pot',
    extensions: ['.hbs', '.js'],
    translateMethods: {
      translate: 'translate',
      translatePlural: 'translateN',
      translateWithContext: 'translateC',
      translatePluralWithContext: 'translateCN',
    },
    ...options,
  };
  return extractHbsTranslations(optionsWithDefaulting);
}
module.exports = extractTranslations;

/**
 * Extracts translations from .hbs files.
 * @param {Object} options
 * @returns {Promise}
 */
function extractHbsTranslations(options) {
  const extensions = options.extensions.join(',');
  const directoryGlobs = options.directories.map(dirpath => `${dirpath}/**/*{${extensions}}`);
  const ignoreGlobs = options.ignore.map(dirpath => `!${dirpath}`);
  const input = globby.sync([...directoryGlobs, ...options.files, ...ignoreGlobs]);
  const {
    translate, translatePlural, translateWithContext, translatePluralWithContext
  } = options.translateMethods;

  /** 
   * Return a promise is necessary because xgettextTemplate runs asynchronously.
   */
  return new Promise(resolve => {
    xgettextTemplate(input, {
      output: options.output,
      language: 'Handlebars',
      keyword:
        `${translate}, ${translatePlural}:1,2, ${translateWithContext}:1,2c, ${translatePluralWithContext}:1,2,3c`,
      'force-po': true
    }, resolve);
  });
}
