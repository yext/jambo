const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git/promise');

const { getRepoForTheme } = require('../../utils/gitutils');
const { CustomCommand } = require('../../utils/customcommands/command');
const { CustomCommandExecuter } = require('../../utils/customcommands/commandexecuter');

const git = simpleGit();

exports.ThemeUpgrader = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._themesDir = jamboConfig.dirs.themes;
  }

  /**
   * Upgrades the given theme to the latest version.
   * @param {string} themeName 
   * @param {string} postUpgradeCommand
   */
  async upgrade(themeName, postUpgradeCommand) {
    const themePath = path.join(this._themesDir, themeName);
    if (!fs.existsSync(themePath)) {
      throw new Error(`theme "${themeName}" not found within the "${this._themesDir}" folder`)
    }
    await this._isGitSubmodule(themePath)
      ? await this._upgradeSubmodule(themePath)
      : await this._upgradeRawFiles(themeName, themePath);
    if (postUpgradeCommand) {
      this._executeCommand(postUpgradeCommand);
    } else {
      console.log(
        'Theme upgrade complete, but no post upgrade commands were run.\n'
        + 'You may need to manually reinstall dependencies (e.g. an npm install).');
    }
  }

  _executeCommand (postUpgradeCommand) {
    const customCommand = new CustomCommand({
      executable: postUpgradeCommand,
    });
    const { stdout, stderr } = new CustomCommandExecuter(this.config).execute(customCommand);
    const stdoutString = stdout.toString().trim();
    const stderrString = stderr.toString().trim();
    stderrString && console.error(stderrString);
    stdoutString && console.log(stdoutString);
  } 

  async _upgradeSubmodule(themePath) {
    await git.submoduleUpdate(['--remote', themePath])
  }

  async _upgradeRawFiles(themeName, themePath) {
    await fs.remove(themePath);
    const themeRepoURL = getRepoForTheme(themeName);
    await git.clone(themeRepoURL, themePath);
  }

  async _isGitSubmodule(themePath) {
    const submodulePaths = await git.subModule(['foreach', '--quiet', 'echo $sm_path']);
    return !!submodulePaths
      .split('\n')
      .find(p => p === themePath)
  }
}
