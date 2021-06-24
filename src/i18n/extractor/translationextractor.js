const globby = require('globby');
const { GettextExtractor} = require('gettext-extractor');
const Handlebars = require('handlebars');
const TranslateInvocation = require('../../handlebars/models/translateinvocation');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { error } = require('../../utils/logger');

/**
 * TranslationExtractor is a class that extracts handlebars translation invocations
 * from a set of files and exports them to an output file.
 */
class TranslationExtractor {
  constructor(options) {
    this._options = {
      translateMethods: [ 'translate', 'translateJS' ], // method names to search for
      baseDirectory: process.cwd(), // the root directory when adding a reference to
                                    // the filepath:linenumber of a translation
      ...options,
    };
    this._extractor = new GettextExtractor();
  }

   /**
    * Extracts messages from all of the input files into the extractor.
    *
    * @param {Array<string>} globs
    */
  extract(globs) {
    const filepaths = globby.sync(globs).map(fp => {
      return path.resolve(this._options.baseDirectory, fp)
    });
    for (const filepath of filepaths) {
      const template = fs.readFileSync(filepath).toString();
      const filepathForReference = path.relative(this._options.baseDirectory, filepath);
      this._extractMessagesFromTemplate(template, filepathForReference);
    }
  }

  /**
   * Returns the extracted messages as a pot file string.
   * //github.com/lukasgeiter/gettext-extractor/wiki/API-Reference#getpotstringheaders
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
  savePotFile(outputPath) {
    const parentDirectory = outputPath.substring(0, outputPath.lastIndexOf('/'));
    parentDirectory && fsExtra.mkdirpSync(parentDirectory);
    this._extractor.savePotFile(outputPath);
  }

  _extractMessagesFromTemplate(template, filepath) {
    try {
      const tree = Handlebars.parseWithoutProcessing(template);
      const visitor = new Handlebars.Visitor();
      visitor.MustacheStatement =
        mustacheStatement => this._handleMustacheStatement(mustacheStatement, filepath);
      visitor.accept(tree);
    } catch (err) {
      error(`Unable to extract translations from ${filepath}`)
      error(err.message);
    }
  }

  _handleMustacheStatement(mustacheStatement, filepath) {
    const isTranslationHelper =
    this._options.translateMethods.includes(mustacheStatement.path.original);
    if (isTranslationHelper) {
      this._registerMessageToExtractor(mustacheStatement, filepath);
    }
  }

  _registerMessageToExtractor(mustacheStatement, filepath) {
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
