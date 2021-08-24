const TranslationExtractor = require('../../i18n/extractor/translationextractor');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');
const { info } = require('../../utils/logger');
const DefaultTranslationGlobber = require('./defaulttranslationglobber');
const { readGitignorePaths } = require('../../utils/gitutils');

/**
 * JamboTranslationExtractor extracts translations from a jambo repo.
 */
class JamboTranslationExtractor {
  constructor(jamboConfig) {
    this.jamboConfig = jamboConfig;
    this.extractor = new TranslationExtractor();
  }

  static getAlias() {
    return 'extract-translations';
  }

  static getShortDescription() {
    return 'extract translated strings from .hbs and .js files';
  }

  static args() {
    return {
      globs: new ArgumentMetadata({
        displayName: 'Globs to Scan',
        type: ArgumentType.ARRAY,
        description:
          'specify globs to scan for translations, instead of using the defaults',
        isRequired: false
      }),
      output: new ArgumentMetadata({
        displayName: 'Output Path',
        type: ArgumentType.STRING,
        description: 'the output path to extract the .pot file to',
        isRequired: false,
        defaultValue: 'messages.pot'
      })
    };
  }

  static describe() {
    const args = this.args();
    return {
      displayName: 'Extract Translations',
      params: Object.keys(args).reduce((params, alias) => {
        params[alias] = args[alias].toDescribeFormat();
        return params;
      }, {})
    };
  }

  execute({ output, globs }) {
    if (globs && globs.length > 0) {
      this._extract(output, globs);
    } else {
      const gitignorePaths = readGitignorePaths();
      const defaultGlobber = new DefaultTranslationGlobber(
        this.jamboConfig.dirs, gitignorePaths);
      const defaultGlobs = defaultGlobber.getGlobs();
      this._extract(output, defaultGlobs);
    }
  }

  /**
   * Extracts i18n strings from a jambo repo to a designed output file.
   *
   * @param {string} outputPath
   * @param {Array<string>} globs
   */
  _extract(outputPath, globs) {
    info(`Extracting translations to ${outputPath}`);
    this.extractor.extract(globs);
    this.extractor.savePotFile(outputPath);
  }
}

module.exports = JamboTranslationExtractor;
