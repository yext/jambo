const path = require('path');
const simpleGit = require('simple-git');
const git = simpleGit();
const { ThemeShadower } = require('../override/themeshadower');
const ThemeManager = require('../../utils/thememanager');
const { getRepoNameFromURL } = require('../../utils/gitutils');
const SystemError = require('../../errors/systemerror');
const UserError = require('../../errors/usererror');
const { isCustomError } = require('../../utils/errorutils');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');
const { CustomCommand } = require('../../utils/customcommands/command');
const { CustomCommandExecuter } = require('../../utils/customcommands/commandexecuter');
const { searchDirectoryIgnoringExtensions } = require('../../utils/fileutils');
const fsExtra = require('fs-extra');
const process = require('process');

/**
 * ThemeImporter imports a specified theme into the themes directory.
 */
class ThemeImporter {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._themeShadower = new ThemeShadower(jamboConfig);
    this._postImportHook = 'postimport';
  }

  static getAlias() {
    return 'import';
  }

  static getShortDescription() {
    return 'import a theme';
  }

  static args() {
    return {
      themeUrl: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'url of the theme\'s git repo',
      }),
      theme: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: '(deprecated: specify the themeUrl instead)'
          + ' the name of the theme to import',
      }),
      useSubmodules: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN,
        description: 'import the theme as a submodule'
      }),
    }
  }

  static describe() {
    const importableThemes = ThemeManager.getKnownThemes();
    return {
      displayName: 'Import Theme',
      params: {
        themeUrl: {
          displayName: 'URL',
          type: 'string',
        },
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          options: importableThemes
        },
        useSubmodules: {
          displayName: 'Use Submodules',
          type: 'boolean'
        }
      }
    }
  }

  async execute(args) {
    await this.import(args.themeUrl, args.theme, args.useSubmodules);
  }

  /**
   * Imports the requested theme into Jambo's Themes directory. Note that the theme can
   * either be cloned directly into this directory or added there as a submodule.
   *
   * @param {string} themeUrl The URL of the theme to import. Takes precedence over the
   *                     'themeName' param.
   * @param {string} themeName The name of a known theme.
   * @param {boolean} useSubmodules If the theme should be imported as a submodule.
   * @returns {Promise<string>} If the addition of the submodule was successful, a Promise
   *                            containing the new submodule's local path. If the addition
   *                            failed, a Promise containing the error.
   */
  async import(themeUrl, themeName, useSubmodules) {
    if (!this.config) {
      throw new UserError('No jambo.json found. Did you `jambo init` yet?');
    }
    if (!themeUrl && !themeName) {
      throw new UserError('A URL or a theme must be specifed for an import');
    }
    try {
      const themeRepo = themeUrl || ThemeManager.getRepoForTheme(themeName);
      const themeRepoName = themeUrl ? getRepoNameFromURL(themeUrl) : themeName;
      const themePath = path.join(this.config.dirs.themes, themeRepoName);
      await git.cwd(process.cwd());
      if (useSubmodules) {
        await git.submoduleAdd(themeRepo, themePath);
      } else {
        await git.clone(themeRepo, themePath);
        this._removeGitFolder(themePath);
      }
      this._postImport(themePath);

      return themePath;
    } catch (err) {
      if (isCustomError(err)) {
        throw err;
      }
      throw new SystemError(err.message, err.stack);
    }
  }

  /**
   * Removes the .git folder from the theme.
   *
   * @param {string} themePath 
   */
  _removeGitFolder(themePath) {
    fsExtra.removeSync(path.join(themePath, '.git'));
  }

  /**
   * Run the post import hook, if one exists.
   * 
   * @param {string} themePath path to the default theme
   */
  _postImport(themePath) {
    const postImportHookFile =
      searchDirectoryIgnoringExtensions(this._postImportHook, themePath);
    if (!postImportHookFile) {
      return;
    }
    const customCommand = new CustomCommand({
      executable: './' + path.join(themePath, postImportHookFile)
    });
    new CustomCommandExecuter(this.config).execute(customCommand);
  }
}

module.exports = ThemeImporter;
