const path = require('path');
const fs = require('fs-extra');

/**
 * Imports all custom {@link Command}s within a Jambo repository.
 */
class CommandImporter {
  constructor(themeDir, outputDir) {
    this._themeDir = themeDir;
    this._outputDir = outputDir;
  }

  /**
   * Imports custom commands from the Theme and the top-level of the Jambo
   * repository. If a custom command is specified in both places, it is deduped, 
   * with the override in the top-level taking priority. 
   * 
   * @returns {Array<Command>} The imported {@link Command}s, ready to be registered
   *                           with Jambo.
   */
  import() {
    const commandDirectories = [path.join(this._themeDir, 'commands'), 'commands']
      .filter(fs.existsSync);

    let customCommands = [];
    if (commandDirectories.length > 0) {
      const mergedDirectory = this._mergeCommandDirectories(commandDirectories);
      customCommands = fs.readdirSync(mergedDirectory)
        .map(directoryPath => path.join(process.cwd(), mergedDirectory, directoryPath))
        .filter(directoryPath => fs.lstatSync(directoryPath).isFile())
        .map(require);

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
   * @param {Array<string>} directories The directories to merge together.
   * @returns {string} The path of the merged output directory.
   */
  _mergeCommandDirectories(directories) {
    const mergedDirectory = path.join(this._outputDir, 'commands');

    // In case the merged directory has not been deleted, do so now.
    if (fs.existsSync(mergedDirectory)) {
      fs.removeSync(mergedDirectory);
    }
    fs.mkdirSync(mergedDirectory);
    directories.forEach(directory => fs.copySync(directory, mergedDirectory));

    return mergedDirectory;
  }
}
module.exports = CommandImporter;