const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git/promise');

const { getRepoForTheme } = require('../../utils/gitutils');
const { CustomCommand } = require('../../utils/customcommands/command');
const { CustomCommandExecuter } = require('../../utils/customcommands/commandexecuter');
const SystemError = require('../../errors/systemerror');
const { exitWithError } = require('../../utils/errorutils');

const git = simpleGit();

/**
 * ThemeUpgrader is responsible for upgrading the current defaultTheme to the latest version.
 * It first detects whether the theme was imported as a submodule or raw files, then handles
 * the upgrade accordingly.
 */
exports.ThemeUpgrader = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._themesDir = jamboConfig.dirs.themes;
    this.upgradeScript = 'upgrade.js';
  }

  /**
   * Upgrades the given theme to the latest version.
   * @param {string} themeName 
   * @param {boolean} disableScript
   * @param {booolean} isLegacy
   */
  async upgrade(themeName, disableScript, isLegacy) {
    const themePath = path.join(this._themesDir, themeName);
    if (!fs.existsSync(themePath)) {
      exitWithError(new SystemError(`Theme "${themeName}" not found within the "${this._themesDir}" folder`));
    }
    await this._isGitSubmodule(themePath)
      ? await this._upgradeSubmodule(themePath)
      : await this._recloneTheme(themeName, themePath);
    const upgradeScriptPath = path.join(themePath, this.upgradeScript);
    if (!disableScript) {
      this._executePostUpgradeScript(upgradeScriptPath, isLegacy);
    }
    if (isLegacy) {
      console.log(
        'Legacy theme upgrade complete. \n' +
        'You may need to manually reinstall dependencies (e.g. an npm install).');
    } else {
      console.log(
        'Theme upgrade complete. \n' +
        'You may need to manually reinstall dependencies (e.g. an npm install).');
    }
  }

  /**
   * Executes the upgrade script, and outputs its stdout and stderr.
   * @param {string} upgradeScriptPath
   * @param {boolean} isLegacy
   */
  _executePostUpgradeScript (upgradeScriptPath, isLegacy) {
    const customCommand = new CustomCommand({
      executable: `./${upgradeScriptPath}`
    });
    if (isLegacy) {
      customCommand.addArgs(['--isLegacy'])
    }
    const { stdout, stderr } = new CustomCommandExecuter(this.config).execute(customCommand);
    const stdoutString = stdout.toString().trim();
    const stderrString = stderr.toString().trim();
    stdoutString && console.log(stdoutString);
    stderrString && exitWithError(new SystemError("Error executing theme post upgrade script", stderrString));
  } 

  /**
   * Calls "git update --remote" on the given submodule path, which
   * updates the given submodule to the most recent version of the branch
   * it is set to track (defaults to master).
   * @param {string} submodulePath 
   */
  async _upgradeSubmodule(submodulePath) {
    await git.submoduleUpdate(['--remote', submodulePath])
  }

  /**
   * @param {string} themeName 
   * @param {string} themePath 
   */
  async _recloneTheme(themeName, themePath) {
    await fs.remove(themePath);
    const themeRepoURL = getRepoForTheme(themeName);
    await git.clone(themeRepoURL, themePath);
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
