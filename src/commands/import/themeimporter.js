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
    if (!this.config) {
      console.warn('No config.json found. Did you `jambo init` yet?')
      return;
    }
    try {
      const themeRepo = this._getRepoForTheme(themeName);
      const localPath = `${this.config.dirs.themes}/${themeName}`;

      await git.submoduleAdd(themeRepo, localPath);

      fs.copyFileSync(
        `${localPath}/global_config.json`,
        `${this.config.dirs.config}/global_config.json`);
      this._copyStaticAssets(localPath);
      this._updateDefaultTheme(themeName);

      return localPath;
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  /**
   * Copies the static assets from the Theme to the repository, if they exist. If a 
   * Gruntfile, webpack-config, or package.json are included among the assets, those are 
   * moved to the top-level of the repository. All other assets are copied over into a
   * 'static' directory.
   * 
   * @param {string} localPath The path of the imported theme in the repository.
   */
  _copyStaticAssets(localPath) {
    const staticAssetsPath = `${localPath}/static`;
    if (fs.existsSync(staticAssetsPath)) {
      fs.copySync(staticAssetsPath, 'static');

      const moveFileIfExists = file => {
        if (fs.existsSync(file)) {
          fs.moveSync(file, file.split('/').pop());
        }
      };
  
      moveFileIfExists('static/Gruntfile.js');
      moveFileIfExists('static/webpack-config.js');
      moveFileIfExists('static/package.json');
    }
  }

  _updateDefaultTheme(themeName) {
    if (this.config.defaultTheme !== themeName) {
      const updatedConfig = Object.assign({}, this.config, { defaultTheme: themeName});
      fs.writeFileSync('config.json', JSON.stringify(updatedConfig, null, 2));
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
