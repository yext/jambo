const fs = require('fs-extra');
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

      fs.copyFileSync(
        `${localPath}/global_config.json`,
        `${this.config.dirs.config}/global_config.json`);

      const staticAssetsPath = `${localPath}/static`;
      if (fs.existsSync(staticAssetsPath)) {
        fs.copySync(staticAssetsPath, 'static');
      }

      return localPath;
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  _getRepoForTheme(themeName) {
    switch (themeName) {
      case 'answers-hitchhiker-theme':
        return 'git@github.com:yext/answers-hitchhiker-theme.git';
      default:
        throw 'Unrecognized theme';
    }
  }
}