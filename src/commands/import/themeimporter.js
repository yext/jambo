const fs = require('file-system');
const simpleGit = require('simple-git/promise');
const git = simpleGit();
const {
  stringify,
  assign
} = require('comment-json');
const { ShadowConfiguration, ThemeShadower } = require('../override/themeshadower');
const { getRepoForTheme } = require('../../utils/gitutils');
const SystemError = require('../../errors/systemerror');
const UserError = require('../../errors/usererror');
const { isCustomError } = require('../../utils/errorutils');
const { FileNames } = require('../../constants');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');

/**
 * ThemeImporter imports a specified theme into the themes directory.
 */
class ThemeImporter{
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._themeShadower = new ThemeShadower(jamboConfig);
  }

  static getAlias() {
    return 'import';
  }

  static getShortDescription() {
    return 'import a theme';
  }

  static args() {
    return {
      theme: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'theme to import',
        isRequired: true
      }),
      addAsSubmodule: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN, 
        description: 'import the theme as a submodule',
        defaultValue: true
      }),
    }
  }

  static describe() {
    const importableThemes = this._getImportableThemes();
    return {
      displayName: 'Import Theme',
      params: {
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          required: true,
          options: importableThemes
        },
        addAsSubmodule: {
          displayName: 'Add as Submodule',
          type: 'boolean',
          default: true
        }
      }
    }
  }

  /**
   * @returns {Array<string>} the names of the available themes to be imported
   */
  static _getImportableThemes() {
    return ['answers-hitchhiker-theme'];
  }

  execute(args) {
    this._import(args.theme, args.addAsSubmodule)
      .then(console.log);
  }

  /**
   * Imports the requested theme into Jambo's Themes directory. Note that the theme can
   * either be cloned directly into this directory or added there as a submodule.
   *
   * @param {string} themeName The name of the theme
   * @param {boolean} addAsSubmodule If the theme should be imported as a submodule.
   * @returns {Promise<string>} If the addition of the submodule was successful, a Promise
   *                            containing the new submodule's local path. If the addition
   *                            failed, a Promise containing the error.
   */
  async import(themeName, addAsSubmodule) {
    if (!this.config) {
      throw new UserError('No jambo.json found. Did you `jambo init` yet?');
    }
    try {
      const themeRepo = getRepoForTheme(themeName);
      const localPath = `${this.config.dirs.themes}/${themeName}`;

      if (addAsSubmodule) {
        await git.submoduleAdd(themeRepo, localPath);
      } else {
        await git.clone(themeRepo, localPath);
      }

      if (fs.existsSync(`${localPath}/${FileNames.LOCALE_CONFIG}`)) {
        fs.copyFileSync(
          `${localPath}/${FileNames.LOCALE_CONFIG}`,
          `${this.config.dirs.config}/${FileNames.LOCALE_CONFIG}`);
      }
      fs.copyFileSync(
        `${localPath}/${FileNames.GLOBAL_CONFIG}`,
        `${this.config.dirs.config}/${FileNames.GLOBAL_CONFIG}`);
      this._copyStaticAssets(localPath);
      this._updateDefaultTheme(themeName);
      this._copyLayoutFiles(themeName);

      return localPath;
    } catch (err) {
      if (isCustomError(err)) {
        throw err;
      }
      throw new SystemError(err.message, err.stack);
    }
  }

  /**
   * Copies the static assets from the Theme to the repository, if they exist. If a
   * Gruntfile, webpack-config, or package.json are included among the assets, those are
   * moved to the top-level of the repository. If scss/answers.scss,
   * scss/answers-variables.scss, scss/fonts.scss, scss/header.scss, scss/footer.scss, or
   * scss/page.scss are included among the assets, those are moved under the static dir
   * of the repository.
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

      const scssFiles = [
        'answers.scss',
        'answers-variables.scss',
        'fonts.scss',
        'header.scss',
        'footer.scss',
        'page.scss'
      ];

      scssFiles.forEach(fileName => {
        copyFileIfExists(
          `${staticAssetsPath}/scss/${fileName}`,
          `${siteStaticDir}/scss/${fileName}`);
      });

      const jsFiles = [
        'formatters-custom.js'
      ];

      jsFiles.forEach(fileName => {
        copyFileIfExists(
          `${staticAssetsPath}/js/${fileName}`,
          `${siteStaticDir}/js/${fileName}`);
      });

      const topLevelStaticFiles = [
        'Gruntfile.js',
        'webpack-config.js',
        'package.json',
        'package-lock.json'
      ];

      topLevelStaticFiles.forEach(fileName => {
        copyFileIfExists(`${staticAssetsPath}/${fileName}`, `${fileName}`);
      });
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

module.exports = ThemeImporter;
