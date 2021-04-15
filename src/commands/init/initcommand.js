const { RepositorySettings, RepositoryScaffolder } = require('./repositoryscaffolder');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');
const ThemeManager = require('../../utils/thememanager');

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
class InitCommand {
  static getAlias() {
    return 'init';
  }

  static getShortDescription() {
    return 'initialize the repository';
  }

  static args() {
    return {
      themeUrl: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'url of a theme\'s git repo to import during the init',
      }),
      theme: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: '(deprecated: specify the themeUrl instead)'
          + ' the name of a theme to import during the init',
        isRequired: false
      }),
      addThemeAsSubmodule: new ArgumentMetadata({
        type: ArgumentType.BOOLEAN, 
        description: 'if starter theme should be imported as submodule',
        defaultValue: true
      }),
    }
  }

  static describe() {
    const importableThemes = ThemeManager.getKnownThemes();
    return {
      displayName: 'Initialize Jambo',
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
        addThemeAsSubmodule: {
          displayName: 'Add Theme as Submodule',
          type: 'boolean',
          default: true
        }
      }
    }
  }

  execute(args) {
    const repositorySettings = new RepositorySettings(args);
    const repositoryScaffolder = new RepositoryScaffolder();
    repositoryScaffolder.create(repositorySettings);
  }
}

module.exports = InitCommand;