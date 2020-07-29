const extractToPot = require('./extract-to-pot');
const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');

exports.i18nExtractor = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    this.files = files;
    this.directories = directories;
    this.gitignorePaths = this._parseGitignorePaths();
  }

  /**
   * Extracts i18n strings from a jambo repo for a given locale
   */
  extract(locale) {
    const options = {
      files: this.files,
      directories: this.directories,
      output: `${locale}.pot`,
      ignore: this.gitignorePaths
    };
    extractToPot(options);
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
      const isFile = path.extname(pathname);
      isFile ? files.push(pathname) : directories.push(pathname);
    }
    return { files: files, directories: directories };
  }
}
