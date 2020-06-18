const fs = require('file-system');
const simpleGit = require('simple-git/promise');
const git = simpleGit();
const {
  stringify,
  assign
} = require('comment-json');
const { addToPartials } = require('../../utils/jamboconfigutils');

exports.ThemeImporter = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Imports the requested theme into Jambo's Themes directory. Note that the theme can either
   * be cloned directly into this directory or added there as a submodule.
   *
   * @param {string} themeName The name of the theme
   * @param {boolean} addAsSubmodule If the theme should be imported as a submodule.
   * @returns {Promise<string>} If the addition of the submodule was successful, a Promise
   *                            containing the new submodule's local path. If the addition failed,
   *                            a Promise containing the error.
   */
  async import(themeName, addAsSubmodule) {
    if (!this.config) {
      console.warn('No jambo.json found. Did you `jambo init` yet?')
      return;
    }
    try {
      const themeRepo = this._getRepoForTheme(themeName);
      const localPath = `${this.config.dirs.themes}/${themeName}`;

      if (addAsSubmodule) {
        await git.submoduleAdd(themeRepo, localPath);
      } else {
        await git.clone(themeRepo, localPath);
      }

      fs.copyFileSync(
        `${localPath}/global_config.json`,
        `${this.config.dirs.config}/global_config.json`);
      this._copyStaticAssets(localPath);
      this._updateDefaultTheme(themeName);
      this._copyLayoutFiles();

      return localPath;
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  /**
   * Copies the file to the given destination path, if exists.
   *
   * @param {string} file The path of the file to copy
   * @param {string} destPath The path where the copy of the file will be put
   */
  _copyFileIfExists = (file, destPath) => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, destPath);
    }
  };

  /**
   * Copies the static assets from the Theme to the repository, if they exist. If a
   * Gruntfile, webpack-config, or package.json are included among the assets, those are
   * moved to the top-level of the repository. If a entry.js file, scss/answers.scss, or
   * answers-variables.scss, scss/fonts.scss are included among the assets, those are
   * moved under the static dir of the repository.
   *
   * @param {string} localPath The path of the imported theme in the repository.
   */
  _copyStaticAssets(localPath) {
    const siteStaticDir = 'static';

    const staticAssetsPath = `${localPath}/static`;
    if (fs.existsSync(staticAssetsPath)) {
      this._copyFileIfExists(`${staticAssetsPath}/scss/answers.scss`, `${siteStaticDir}/scss/answers.scss`);
      this._copyFileIfExists(`${staticAssetsPath}/scss/answers-variables.scss`, `${siteStaticDir}/scss/answers-variables.scss`);
      this._copyFileIfExists(`${staticAssetsPath}/scss/fonts.scss`, `${siteStaticDir}/scss/fonts.scss`);

      this._copyFileIfExists(`${staticAssetsPath}/Gruntfile.js`, 'Gruntfile.js');
      this._copyFileIfExists(`${staticAssetsPath}/webpack-config.js`, 'webpack-config.js');
      this._copyFileIfExists(`${staticAssetsPath}/package.json`, 'package.json');
      this._copyFileIfExists(`${staticAssetsPath}/package-lock.json`, 'package-lock.json');
    }
  }

  _copyLayoutFiles(themePath) {
    let layoutPath = 'layouts';
    addToPartials(layoutPath);
    this._copyFileIfExists(`${themePath}/${layoutPath}/header.hbs`, `${layoutPath}/header.hbs`);
    this._copyFileIfExists(`${themePath}/${layoutPath}/footer.hbs`, `${layoutPath}/footer.hbs`);
    this._copyFileIfExists(`${themePath}/${layoutPath}/headincludes.hbs`, `${layoutPath}/headincludes.hbs`);
  }

  _updateDefaultTheme(themeName) {
    if (this.config.defaultTheme !== themeName) {
      const updatedConfig = assign({ defaultTheme: themeName }, this.config);
      fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
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
