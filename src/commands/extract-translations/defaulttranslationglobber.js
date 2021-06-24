const fs = require('fs');

module.exports = class DefaultTranslationGlobber {
  constructor(dirs = {}, ignoredPaths = []) {
    this.pages = dirs.pages || '';
    this.partials = dirs.partials || [];
    this.ignoredPaths = ignoredPaths;
    this.extensions = ['.js', '.hbs']; // only extract from files with these extensions
  }

  getGlobs() {
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    return this._globInputFilePaths(directories, files, this.ignoredPaths);
  }

  /**
   * Globs together an array of files to extract from.
   *
   * @param {Array<string>} directories directories to recursively extract from
   * @param {Array<string>} specificFiles specific files to extract from
   * @param {Array<string>} ignoredPaths paths to recursively ignore
   * @returns {Array<string>}
   */
   _globInputFilePaths(directories, specificFiles, ignoredPaths) {
    const extensions = this.extensions.join(',');
    const directoryGlobs = directories.map(dirpath => `${dirpath}/**/*{${extensions}}`);
    const ignoreGlobs = ignoredPaths.map(dirpath => `!${dirpath}`);
    return [...directoryGlobs, ...specificFiles, ...ignoreGlobs];
  }

  /**
   * Returns an array of files and array of directories contained in the jamboConfig.
   *
   * @returns {{files: Array.<string>, directories: Array.<string>}}
   */
   _getFilesAndDirsFromJamboConfig() {
    const files = [];
    const directories = [];
    const pathsThatExist = [this.pages, ...this.partials].filter(p => fs.existsSync(p));
    for (const pathname of pathsThatExist) {
      const isFile = fs.lstatSync(pathname).isFile();
      if (isFile) {
        files.push(pathname);
      } else {
        directories.push(pathname);
      }
    }
    return { files: files, directories: directories };
  }
}