const globby = require('globby');
const { GettextExtractor} = require('gettext-extractor');
const Handlebars = require('handlebars');
const TranslateInvocation = require('../../handlebars/models/translateinvocation');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');

/**
 * TranslationExtractor is a class that extracts handlebars translation invocations
 * from a set of files and exports them to an output file.
 */
class TranslationExtractor {
  constructor(options) {
    this._options = {
      extensions: ['.hbs', '.js'], // only extract from files with these extensions
      translateMethods: [ 'translate', 'translateJS' ], // method names to search for
      baseDirectory: process.cwd(), // the root directory when adding a reference to the filepath:linenumber of a translation
      ...options,
    };
    this._extractor = new GettextExtractor(); 
  }

   /**
    * Extracts messages from all of the input files into the extractor.
    * @param {Object} input
    * @param {Array<string>} input.directories directories to recursively extract from
    * @param {Array<string>} input.specificFiles specific files to extract from 
    * @param {Array<string>} input.ignoredPaths paths to recursively ignore
    */
  extract (input) {
    const { directories, specificFiles, ignoredPaths} = input;
    const filepaths = this._globInputFilePaths(directories || [], specificFiles || [], ignoredPaths || []);
    for (const filepath of filepaths) {
      const template = fs.readFileSync(filepath).toString();
      const filepathForReference = path.relative(this._options.baseDirectory, filepath);
      this._extractMessagesFromTemplate(template, filepathForReference);
    }
  }

  /**
   * Returns the extracted messages as a pot file string.
   * https://github.com/lukasgeiter/gettext-extractor/wiki/API-Reference#getpotstringheaders
   * @returns {Array<Object>}
   */
  getPotString() {
    return this._extractor.getPotString();
  }

  /**
   * Saves the currently extracted messages to a pot file with the designed path.
   * Creates any parent directories as necessary.
   * @param {string} outputPath
   */
  savePotFile (outputPath = 'messages.pot') {
    const parentDirectory = outputPath.substring(0, outputPath.lastIndexOf('/'));
    parentDirectory && fsExtra.mkdirpSync(parentDirectory);
    this._extractor.savePotFile(outputPath);
  }

   /**
    * Globs together an array of files to extract from.
    * @param {Array<string>} directories directories to recursively extract from
    * @param {Array<string>} specificFiles specific files to extract from 
    * @param {Array<string>} ignoredPaths paths to recursively ignore
    * @returns {Array<string>}
    */
  _globInputFilePaths (directories, specificFiles, ignoredPaths) {
    const extensions = this._options.extensions.join(',');
    const directoryGlobs = directories.map(dirpath => `${dirpath}/**/*{${extensions}}`);
    const ignoreGlobs = ignoredPaths.map(dirpath => `!${dirpath}`);
    const files = globby.sync([...directoryGlobs, ...specificFiles, ...ignoreGlobs]);
    return files;
  }

  _extractMessagesFromTemplate(template, filepath) {
    const tree = Handlebars.parseWithoutProcessing(template);
    for (const statement of tree.body) {
      if (this._statementIsTranslationHelper(statement)) {
        this._registerMessageToExtractor(statement, filepath);
      }
    }
  }

  _statementIsTranslationHelper (statement) {
    return statement.type === 'MustacheStatement' &&
      this._options.translateMethods.includes(statement.path.original);
  }
  
  _registerMessageToExtractor (mustacheStatement, filepath) {
    const invocation = TranslateInvocation.fromMustacheStatementNode(mustacheStatement);
    this._extractor.addMessage({
      text: invocation.getPhrase(),
      textPlural: invocation.getPluralForm(),
      context: invocation.getContext(),
      references: [`${filepath}:${invocation.getLineNumber()}`]
    });
  }
}

module.exports = TranslationExtractor;
