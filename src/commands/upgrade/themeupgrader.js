const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git/promise');

const { getRepoForTheme } = require('../../utils/gitutils');
const { CustomCommand } = require('../../utils/customcommands/command');
const { CustomCommandExecuter } = require('../../utils/customcommands/commandexecuter');

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
  }

  /**
   * Upgrades the given theme to the latest version.
   * @param {string} themeName 
   * @param {string} postUpgradeScript
   */
  async upgrade(themeName, postUpgradeScript) {
    const themePath = path.join(this._themesDir, themeName);
    if (!fs.existsSync(themePath)) {
      throw new Error(`theme "${themeName}" not found within the "${this._themesDir}" folder`)
    }
    await this._isGitSubmodule(themePath)
      ? await this._upgradeSubmodule(themePath)
      : await this._recloneTheme(themeName, themePath);
    if (postUpgradeScript) {
      this._executePostUpgradeScript(postUpgradeScript);
    } else {
      console.log(
        'Theme upgrade complete, but no post upgrade commands were run.\n'
        + 'You may need to manually reinstall dependencies (e.g. an npm install).');
    }
  }

  /**
   * @param {string} postUpgradeScript e.g. 'echo "start upgrade"; ./my-upgrade-script.sh'
   */
  _executePostUpgradeScript (postUpgradeScript) {
    const customCommand = new CustomCommand({
      executable: `./${postUpgradeScript}`,
    });
    const { stdout, stderr } = new CustomCommandExecuter(this.config).execute(customCommand);
    const stdoutString = stdout.toString().trim();
    const stderrString = stderr.toString().trim();
    stderrString && console.error(stderrString);
    stdoutString && console.log(stdoutString);
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
