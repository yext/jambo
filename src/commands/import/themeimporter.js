const simpleGit = require('simple-git/promise');
const git = simpleGit();

exports.ThemeImporter = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Imports the requested theme as a Git submodule in Jambo's Themes directory.
   *
   * @param {string} themeName The name of the theme
   * @returns {Promise<string>} If the addition of the submodule was successful, a Promise
   *                            containing the new submodule's local path. If the addition failed,
   *                            a Promise containing the error.
   */
  async import(themeName) {
    try {
      const themeRepo = this._getRepoForTheme(themeName);
      const localPath = `${this.config.dirs.themes}/${themeName}`;

      await git.submoduleAdd(themeRepo, localPath);

      return localPath;
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  _getRepoForTheme(themeName) {
    switch (themeName) {
      case 'answers-cream-theme':
        return 'git@github.com:yext/answers-cream-theme.git';
      default:
        throw 'Unrecognized theme';
    }
  }
}