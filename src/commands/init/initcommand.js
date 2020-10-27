const { RepositorySettings, RepositoryScaffolder } = require('./repositoryscaffolder');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
class InitCommand {
  getAlias() {
    return 'init';
  }

  getShortDescription() {
    return 'initialize the repository';
  }

  args() {
    return {
      theme: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'a starter theme',
        isRequired: false
      }),
      addThemeAsSubmodule: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN, 
        description: 'if starter theme should be imported as submodule',
        defaultValue: true
      }),
    }
  }

  describe() {
    const importableThemes = this._getImportableThemes();
    return {
      displayName: 'Initialize Jambo',
      params: {
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          options: importableThemes
        },
        addThemeAsSubmodule: {
          displayName: 'Add Theme as Submodule',
          type: 'boolean',
          default: true
        }
      }
    }
  }

  /**
   * @returns {Array<string>} the names of the available themes to be imported
   */
  _getImportableThemes() {
    return ['answers-hitchhiker-theme'];
  }

  execute(args) {
    const repositorySettings = new RepositorySettings(args);
    const repositoryScaffolder = new RepositoryScaffolder();
    repositoryScaffolder.create(repositorySettings);
  }
}

module.exports = InitCommand;