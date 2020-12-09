const path = require('path');
const simpleGit = require('simple-git/promise');
const git = simpleGit();
const { ThemeShadower } = require('../override/themeshadower');
const { getRepoForTheme } = require('../../utils/gitutils');
const SystemError = require('../../errors/systemerror');
const UserError = require('../../errors/usererror');
const { isCustomError } = require('../../utils/errorutils');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');
const { CustomCommand } = require('../../utils/customcommands/command');
const { CustomCommandExecuter } = require('../../utils/customcommands/commandexecuter');
const { searchDirectoryIgnoringExtensions } = require('../../utils/fileutils');

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
  async _import(themeName, addAsSubmodule) {
    if (!this.config) {
      throw new UserError('No jambo.json found. Did you `jambo init` yet?');
    }
    try {
      const themeRepo = getRepoForTheme(themeName);
      const themePath = path.join(this.config.dirs.themes, themeName);

      if (addAsSubmodule) {
        await git.submoduleAdd(themeRepo, themePath);
      } else {
        await git.clone(themeRepo, themePath);
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
