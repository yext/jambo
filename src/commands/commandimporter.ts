import path from 'path';
import fs from 'fs-extra';
import LegacyAdapter from './LegacyAdapter';

/**
 * Imports all custom {@link Command}s within a Jambo repository.
 */
export default class CommandImporter {
  private _outputDir: string
  private _themeDir: string

  constructor(outputDir, themeDir?) {
    this._outputDir = outputDir;
    this._themeDir = themeDir;
  }

  /**
   * Imports custom commands from the Theme (if one has been applied) and the top-level
   * of the Jambo repository. If a custom command is specified in both places, it is
   * deduped, with the override in the top-level taking priority.
   *
   * @returns {Array<{Command}>} The imported {@link Command}s, ready to be registered
   *                             with Jambo.
   */
  import() {
    let commandDirectories = ['commands'];
    this._themeDir && commandDirectories.unshift(path.join(this._themeDir, 'commands'));
    commandDirectories = commandDirectories.filter(fs.existsSync);
    const customCommands = [];
    if (commandDirectories.length > 0) {
      const mergedDirectory = this._mergeCommandDirectories(commandDirectories);
      const currDirectory = process.cwd();
      fs.readdirSync(mergedDirectory)
        .map(directoryPath => path.resolve(currDirectory, mergedDirectory, directoryPath))
        .filter(directoryPath => directoryPath.endsWith('.js'))
        .filter(directoryPath => fs.lstatSync(directoryPath).isFile())
        .forEach(filePath => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const requiredModule = require(filePath);
          const commandClass = new LegacyAdapter().adapt(requiredModule, filePath);
          customCommands.push(commandClass);
        });

      // Remove the merged commands directory from 'public' as it is no longer needed.
      fs.removeSync(mergedDirectory);
    }
    return customCommands;
  }

  /**
   * Merges the provided custom command directories together. The resulting, merged
   * directory is in 'public'. The order in which directories are provided matters,
   * later ones can overwrite existing files.
   *
   * @param {string[]} directories The directories to merge together.
   * @returns {string} The path of the merged output directory.
   */
  _mergeCommandDirectories(directories: string[]) {
    const mergedDirectory = path.join(this._outputDir, 'commands');

    // In case the merged directory has not been deleted, do so now.
    if (fs.existsSync(mergedDirectory)) {
      fs.removeSync(mergedDirectory);
    }
    fs.ensureDirSync(mergedDirectory);
    directories.forEach(directory => fs.copySync(directory, mergedDirectory));

    return mergedDirectory;
  }
}
