const TranslationExtractor = require('../../i18n/extractor/translationextractor');
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

  /**
   * Extracts i18n strings from a jambo repo to a designed output file.
   */
  async extract(outputPath) {
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
