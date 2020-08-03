const extractTranslations = require('../../i18n/extract/extracttranslations');
const fsExtra = require('fs-extra');
const fs = require('fs');

/**
 * i18nExtractor extracts i18n messages from a jambo repo.
 */
exports.i18nExtractor = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    this.files = files;
    this.directories = directories;
    this.gitignorePaths = this._parseGitignorePaths();
  }

  /**
   * Extracts i18n strings from a jambo repo for a given locale.
   */
  async extract(locale) {
    const outputFile = `${locale}.pot`;
    const options = {
      files: this.files,
      directories: this.directories,
      output: outputFile,
      ignore: this.gitignorePaths
    };
    await extractTranslations(options);
    console.log(`Extracted translations to ${outputFile}`);
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
