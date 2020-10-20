const TranslationExtractor = require('../../i18n/extractor/translationextractor');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');
const fsExtra = require('fs-extra');
const fs = require('fs');

/**
 * JamboTranslationExtractor extracts translations from a jambo repo.
 */
class JamboTranslationExtractor {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this.extractor = new TranslationExtractor();
  }

  getAlias() {
    return 'extract-translations';
  }

  getShortDescription() {
    return 'extract translated strings from .hbs and .js files';
  }

  args() {
    return {
      output: new ArgumentMetadata({
        displayName: 'Output Path',
        type: ArgumentType.STRING,
        description: 'the output path to extract the .pot file to',
        isRequired: false,
        defaultValue: 'messages.pot'
      })
    };
  }

  describe() {
    const args = this.args();
    return {
      displayName: 'Extract Translations',
      params: Object.keys(args).reduce((params, alias) => {
        params[alias] = args[alias].serialize();
        return params;
      }, {})
    };
  }

  execute(args) {
    this._extract(args.output);
  }

  /**
   * Extracts i18n strings from a jambo repo to a designed output file.
   * @param {string} outputPath
   */
  async _extract(outputPath) {
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    const gitignorePaths = this._parseGitignorePaths();
    console.log(`Extracting translations to ${outputPath}`);
    this.extractor.extract({
      specificFiles: files,
      directories: directories,
      ignoredPaths: gitignorePaths
    });
    this.extractor.savePotFile(outputPath);
  }

  /**
   * Gets the list of gitignored paths, if a .gitignore file exists.
   * @returns {Promise.<Array.<string>>}
   */
  _parseGitignorePaths() {
    if (fsExtra.pathExistsSync('.gitignore')) {
      const ignoredPaths = fs.readFileSync('.gitignore', 'utf-8');
      return ignoredPaths.split('\n').filter(pathname => pathname);
    }
    return [];
  }

  /**
   * Returns an array of files and array of directories contained in the jamboConfig.
   * @returns {{files: Array.<string>, directories: Array.<string>}}
   */
  _getFilesAndDirsFromJamboConfig() {
    const { pages, partials } = this.config.dirs;
    const files = [];
    const directories = [];
    for (const pathname of [pages, ...partials]) {
      const isFile = fs.existsSync(pathname) && fs.lstatSync(pathname).isFile();
      isFile ? files.push(pathname) : directories.push(pathname);
    }
    return { files: files, directories: directories };
  }
}

module.exports = JamboTranslationExtractor;
