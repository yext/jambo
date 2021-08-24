const fs = require('fs');

/**
 * DefaultTranslationGlobber contains the default logic for determining
 * which files are scanned by the extract-translations command.
 */
module.exports = class DefaultTranslationGlobber {
  constructor(dirs = {}, ignoredPaths = []) {
    this.pages = dirs.pages || '';
    this.partials = dirs.partials || [];
    this.ignoredPaths = ignoredPaths;
    this.extensions = ['.js', '.hbs']; // only extract from files with these extensions
  }

  /**
   * Returns the default globs to be scanned, using the given
   * site specific templates and partials, as well as any ignored paths.
   *
   * @returns {Array<string>}
   */
  getGlobs() {
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    return this._globInputFilePaths(directories, files, this.ignoredPaths);
  }

  /**
   * Globs together the given directories, files, and ignored paths.
   *
   * @param {Array<string>} directories directories to recursively extract from
   * @param {Array<string>} files any individual files to extract from
   * @param {Array<string>} ignoredPaths paths to recursively ignore
   * @returns {Array<string>}
   */
   _globInputFilePaths(directories, files, ignoredPaths) {
    const extensions = this.extensions.join(',');
    const directoryGlobs = directories.map(dirpath => `${dirpath}/**/*{${extensions}}`);
    const ignoreGlobs = ignoredPaths.map(dirpath => `!${dirpath}`);
    return [...directoryGlobs, ...files, ...ignoreGlobs];
  }

  /**
   * Returns the site-specific partials/templates in a jambo config,
   * separating them based on whether they are files or directories.
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