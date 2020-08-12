const fs = require('file-system');
const simpleGit = require('simple-git/promise');
const git = simpleGit();
const {
  stringify,
  assign
} = require('comment-json');
const { ShadowConfiguration, ThemeShadower } = require('../override/themeshadower');
const { getRepoForTheme } = require('../../utils/gitutils');

exports.ThemeImporter = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._themeShadower = new ThemeShadower(jamboConfig);
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
      const themeRepo = getRepoForTheme(themeName);
      const localPath = `${this.config.dirs.themes}/${themeName}`;

      if (addAsSubmodule) {
        await git.submoduleAdd(themeRepo, localPath);
      } else {
        await git.clone(themeRepo, localPath);
      }

      if(fs.existsSync(`${localPath}/locale_config.json`)) {
        fs.copyFileSync(
          `${localPath}/locale_config.json`,
          `${this.config.dirs.config}/locale_config.json`);
      }
      fs.copyFileSync(
        `${localPath}/global_config.json`,
        `${this.config.dirs.config}/global_config.json`);
      this._copyStaticAssets(localPath);
      this._updateDefaultTheme(themeName);
      this._copyLayoutFiles(themeName);

      return localPath;
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

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
      const copyFileIfExists = (file, destPath) => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, destPath);
        }
      };

      copyFileIfExists(`${staticAssetsPath}/scss/answers.scss`, `${siteStaticDir}/scss/answers.scss`);
      copyFileIfExists(`${staticAssetsPath}/scss/answers-variables.scss`, `${siteStaticDir}/scss/answers-variables.scss`);
      copyFileIfExists(`${staticAssetsPath}/scss/fonts.scss`, `${siteStaticDir}/scss/fonts.scss`);

      copyFileIfExists(`${staticAssetsPath}/Gruntfile.js`, 'Gruntfile.js');
      copyFileIfExists(`${staticAssetsPath}/webpack-config.js`, 'webpack-config.js');
      copyFileIfExists(`${staticAssetsPath}/package.json`, 'package.json');
      copyFileIfExists(`${staticAssetsPath}/package-lock.json`, 'package-lock.json');
    }
  }

  _copyLayoutFiles(themeName) {
    console.log('importing header');
    this._themeShadower.createShadow(new ShadowConfiguration({
      theme: themeName,
      path: 'layouts/header.hbs',
    }));

    console.log('importing footer');
    this._themeShadower.createShadow(new ShadowConfiguration({
      theme: themeName,
      path: 'layouts/footer.hbs',
    }));

    console.log('importing headincludes');
    this._themeShadower.createShadow(new ShadowConfiguration({
      theme: themeName,
      path: 'layouts/headincludes.hbs',
    }));
  }

  _updateDefaultTheme(themeName) {
    if (this.config.defaultTheme !== themeName) {
      const updatedConfig = assign({ defaultTheme: themeName }, this.config);
      fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
    }
  }
}
