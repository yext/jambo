import fs from 'fs';

/**
 * DefaultTranslationGlobber contains the default logic for determining
 * which files are scanned by the extract-translations command.
 */
export default class DefaultTranslationGlobber {
  pages: string;
  partials: string[];
  ignoredPaths: string[];
  extensions: ['.js', '.hbs'];

  constructor(dirs: any = {}, ignoredPaths = []) {
    this.pages = dirs.pages || '';
    this.partials = dirs.partials || [];
    this.ignoredPaths = ignoredPaths;
    this.extensions = ['.js', '.hbs']; // only extract from files with these extensions
  }

  /**
   * Returns the default globs to be scanned, using the given
   * site specific templates and partials, as well as any ignored paths.
   *
   * @returns {string[]}
   */
  getGlobs() {
    const { files, directories } = this._getFilesAndDirsFromJamboConfig();
    return this._globInputFilePaths(directories, files, this.ignoredPaths);
  }

  /**
   * Globs together the given directories, files, and ignored paths.
   *
   * @param {string[]} directories directories to recursively extract from
   * @param {string[]} files any individual files to extract from
   * @param {string[]} ignoredPaths paths to recursively ignore
   * @returns {string[]}
   */
  _globInputFilePaths(directories: string[], files: string[], ignoredPaths: string[]) {
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