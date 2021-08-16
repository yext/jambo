import fs from 'fs-extra';
import path from 'path';
import simpleGit from 'simple-git/promise';
import ThemeManager from '../../utils/thememanager';
import { CustomCommand } from '../../utils/customcommands/command';
import { CustomCommandExecuter } from '../../utils/customcommands/commandexecuter';
import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import SystemError from '../../errors/systemerror';
import UserError from '../../errors/systemerror';
import { isCustomError } from '../../utils/errorutils';
import { searchDirectoryIgnoringExtensions } from '../../utils/fileutils';
import fsExtra from 'fs-extra';
import { info } from '../../utils/logger';

const git = simpleGit();

/**
 * ThemeUpgrader is responsible for upgrading the current defaultTheme to the latest
 * version. It first detects whether the theme was imported as a submodule or raw files,
 * then handles the upgrade accordingly.
 */
class ThemeUpgrader {
  constructor(jamboConfig = {}) {
    this.jamboConfig = jamboConfig;
    this._themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    this.postUpgradeFileName = 'upgrade';
  }

  static getAlias() {
    return 'upgrade';
  }

  static getShortDescription() {
    return 'upgrade the default theme to the latest version';
  }

  static args() {
    return {
      disableScript: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN,
        description: 'disable execution of ./upgrade.js after the upgrade is done',
        isRequired: false
      }),
      isLegacy: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN,
        description: 'whether to pass the --isLegacy flag to ./upgrade.js',
        isRequired: false
      }),
      branch: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'the branch of the theme to upgrade to',
        isRequired: false,
        defaultValue: 'master'
      })
    }
  }

  static async describe(jamboConfig) {
    return {
      displayName: 'Upgrade Theme',
      params: {
        isLegacy: {
          displayName: 'Is Legacy Upgrade',
          type: 'boolean'
        },
        disableScript: {
          displayName: 'Disable Upgrade Script',
          type: 'boolean'
        },
        branch: {
          displayName: 'Branch of theme to upgrade to',
          type: 'string',
          default: 'master'
        }
      }
    }
  }

  async execute(args) {
    await this._upgrade({
      themeName: this.jamboConfig.defaultTheme,
      disableScript: args.disableScript,
      isLegacy: args.isLegacy,
      branch: args.branch
    }).catch(err => {
      if (isCustomError(err)) {
        throw err;
      }
      throw new SystemError(err.message, err.stack);
    });
  }

  /**
   * Upgrades the given theme to the latest version.
   * @param {string} themeName The name of the theme
   * @param {boolean} disableScript Whether to run the upgrade script
   * @param {boolean} isLegacy Whether to use the isLegacy flag in the upgrade script
   * @param {string} branch The name of the branch to upgrade to
   */
  async _upgrade({ themeName, disableScript, isLegacy, branch }) {
    const themePath = path.join(this._themesDir, themeName);
    if (!fs.existsSync(themePath)) {
      throw new UserError(
        `Theme "${themeName}" not found within the "${this._themesDir}" folder`);
    }
    if (await this._isGitSubmodule(themePath)) {
      await this._upgradeSubmodule(themePath, branch)
    } else {
      const tempDir = fs.mkdtempSync('./');
      try { 
        fs.copySync(themePath, tempDir);
        await this._recloneTheme(themeName, themePath, branch);
        this._removeGitFolder(themePath);
        fs.removeSync(tempDir);
      }
      catch (error) {
        fs.moveSync(tempDir, themePath);
        throw error;
      }
    }
    if (!disableScript) {
      this._executePostUpgradeScript(themePath, isLegacy);
    }
    if (isLegacy) {
      info(
        'Legacy theme upgrade complete. \n' +
        'You may need to manually reinstall dependencies (e.g. an npm install).');
    } else {
      info(
        'Theme upgrade complete. \n' +
        'You may need to manually reinstall dependencies (e.g. an npm install).');
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
   * Executes the upgrade script, and outputs its stdout and stderr.
   * @param {string} themePath path to the default theme
   * @param {boolean} isLegacy
   */
  _executePostUpgradeScript(themePath, isLegacy) {
    const upgradeScriptName =
      searchDirectoryIgnoringExtensions(this.postUpgradeFileName, themePath)
    const upgradeScriptPath = path.join(themePath, upgradeScriptName);
    const customCommand = new CustomCommand({
      executable: `./${upgradeScriptPath}`
    });
    if (isLegacy) {
      customCommand.addArgs(['--isLegacy'])
    }
    new CustomCommandExecuter(this.jamboConfig).execute(customCommand);
  }

  /**
   * Calls "git update --remote" on the given submodule path, which
   * updates the given submodule to the most recent version of the branch
   * it is set to track. If a branch is specified, the given submodule 
   * will be updated to the provided branch.
   * @param {string} submodulePath
   * @param {string} branch
   */
  async _upgradeSubmodule(submodulePath, branch) {
    if (branch) {
      await git.subModule(['set-branch', '--branch', branch, submodulePath]);
    }
    await git.submoduleUpdate(['--remote', submodulePath]);
  }

  /**
   * @param {string} themeName
   * @param {string} themePath
   * @param {string} branch
   */
  async _recloneTheme(themeName, themePath, branch) {
    await fs.remove(themePath);
    const themeRepoURL = ThemeManager.getRepoForTheme(themeName);
    const updateBranch = branch || 'master';
    await git.clone(themeRepoURL, themePath, ['--branch', updateBranch]);
  }

  /**
   * Returns whether the given file path is registered as a git submodule.
   * @param {string} submodulePath
   * @returns {boolean}
   */
  async _isGitSubmodule(submodulePath) {
    const submodulePaths = await git.subModule(['foreach', '--quiet', 'echo $sm_path']);
    return !!submodulePaths
      .split('\n')
      .find(p => p === submodulePath)
  }
}

export default ThemeUpgrader;
