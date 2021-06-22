const path = require('path');
const fs = require('fs-extra');
const { warn } = require('../utils/logger');

/**
 * Imports all custom {@link Command}s within a Jambo repository.
 */
class CommandImporter {
  constructor(outputDir, themeDir) {
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
    let customCommands = [];
    if (commandDirectories.length > 0) {
      const mergedDirectory = this._mergeCommandDirectories(commandDirectories);
      const currDirectory = process.cwd();
      fs.readdirSync(mergedDirectory)
        .map(directoryPath => path.resolve(currDirectory, mergedDirectory, directoryPath))
        .filter(directoryPath => directoryPath.endsWith('.js'))
        .filter(directoryPath => fs.lstatSync(directoryPath).isFile())
        .forEach(filePath => {
          const requiredModule = require(filePath);
          const commandClass = this._isLegacyImport(requiredModule) ?
            this._handleLegacyImport(requiredModule) :
            requiredModule;

          if (this._validateCustomCommand(commandClass)) {
            customCommands.push(commandClass);
          } else {
            warn(`Command in ${path.basename(filePath)} was not formatted properly`);
          }
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
   * @param {Array<string>} directories The directories to merge together.
   * @returns {string} The path of the merged output directory.
   */
  _mergeCommandDirectories(directories) {
    const mergedDirectory = path.join(this._outputDir, 'commands');

    // In case the merged directory has not been deleted, do so now.
    if (fs.existsSync(mergedDirectory)) {
      fs.removeSync(mergedDirectory);
    }
    fs.ensureDirSync(mergedDirectory);
    directories.forEach(directory => fs.copySync(directory, mergedDirectory));

    return mergedDirectory;
  }

  /**
   * Validates an imported custom {@link Command} by ensuring the class has all
   * of the expected static and instance methods.
   * 
   * @param {Clazz} commandClass The custom {@link Command}'s class
   * @returns {boolean} A boolean indicating if the custom {@Command} is valid.
   */
  _validateCustomCommand(commandClass) {
    let isValidCommand;
    try {
      const getMethods = (classObject) => Object.getOwnPropertyNames(classObject)
        .filter(propName => typeof classObject[propName] === 'function');

      const staticMethods = getMethods(commandClass);
      const expectedStaticMethods = 
        ['getAlias', 'getShortDescription', 'args', 'describe'];

      const instanceMethods = getMethods(commandClass.prototype);
      const expectedInstanceMethods = ['execute'];

      isValidCommand = 
        expectedStaticMethods.every(method => staticMethods.includes(method)) &&
        expectedInstanceMethods.every(method => instanceMethods.includes(method));
    } catch {
      isValidCommand = false;
    }

    return isValidCommand;
  }
  
  /**
   * Verifies if the require'd module corresponds to a legacy command import.
   * 
   * @param {any} requiredModule The require'd module.
   * @return {boolean} Boolean indicating if this is a legacy command import.
   */
  _isLegacyImport(requiredModule) {
    return !('prototype' in requiredModule);
  }

  /**
   * Creates an implementation of the current {@link Command} interface that wraps the
   * result of a legacy command import.
   * 
   * @param {Function} commandCreator The function provided by a legacy command import.
   * @returns {class} An implemenation of the current {@link Command} interface.
   */
  _handleLegacyImport(commandCreator) {
    return class {
      constructor(jamboConfig) {
        this._wrappedInstance = commandCreator(jamboConfig);
      }

      static getAlias() {
        return commandCreator({}).getAlias();
      }

      static getShortDescription() {
        return commandCreator({}).getShortDescription();
      }

      static args() {
        return commandCreator({}).args();
      }

      static describe(jamboConfig) {
        return commandCreator(jamboConfig).describe();
      }

      execute(args) {
        return this._wrappedInstance.execute(args);
      }
    }
  }
}
module.exports = CommandImporter;