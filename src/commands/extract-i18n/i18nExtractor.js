const extractToPot = require('./extract-to-pot');
const path = require('path');
const fsExtra = require('fs-extra');

exports.i18nExtractor = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Extracts i18n strings from a jambo repo into a .pot file.
   */
  async extract() {
    const { files, directories } = this._getInputFilesAndDirs();
    directories.push('static');
    const gitignorePaths = await this._parseGitignorePaths();
    const options = {
      files: files,
      directories: directories,
      output: 'messages.pot',
      ignore: gitignorePaths
    };
    await extractToPot(options);
  }

  /**
   * Gets the list of gitignored paths, if a .gitignore file exists.
   * @returns {Promise.<Array.<string>>}
   */
  async _parseGitignorePaths() {
    if (await fsExtra.pathExists('.gitignore')) {
      const ignoredPaths = await fsExtra.readFile('.gitignore', 'utf-8');
      return ignoredPaths.split('\n').map(pathname => {
        const isFile = path.extname(pathname);
        return isFile ? pathname : `${pathname}/**/*`;
      });
    }
    return [];
  }

  /**
   * Returns an array of files and array of directories to search for i18n strings.
   * @returns {{files: Array.<string>, directories: Array.<string>}}
   */
  _getInputFilesAndDirs() {
    const { themes, pages, partials } = this.config.dirs;
    const files = [];
    const directories = [];
    for (const pathname of [themes, pages, ...partials]) {
      const isFile = path.extname(pathname);
      isFile ? files.push(pathname) : directories.push(pathname);
    }
    return { files: files, directories: directories };
  }
}
