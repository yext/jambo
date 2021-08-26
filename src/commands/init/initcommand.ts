import { RepositorySettings, RepositoryScaffolder } from './repositoryscaffolder';
import { ArgumentMetadataImpl } from '../../models/commands/argumentmetadata';
import ThemeManager from '../../utils/thememanager';
import Command from '../../models/commands/command';

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
const InitCommand : Command = class {
  static getAlias() {
    return 'init';
  }

  static getShortDescription() {
    return 'initialize the repository';
  }

  static args() {
    return {
      themeUrl: new ArgumentMetadataImpl({
        type: 'string',
        description: 'url of a theme\'s git repo to import during the init',
      }),
      theme: new ArgumentMetadataImpl({
        type: 'string',
        description: '(deprecated: specify the themeUrl instead)'
          + ' the name of a theme to import during the init',
        isRequired: false
      }),
      useSubmodules: new ArgumentMetadataImpl({
        type: 'boolean', 
        description: 'if starter theme should be imported as submodule'
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
        useSubmodules: {
          displayName: 'Use Submodules',
          type: 'boolean'
        }
      }
    }
  }

  async execute(args: RepositorySettings) {
    const repositoryScaffolder = new RepositoryScaffolder();
    await repositoryScaffolder.create(args);
  }
}

export default InitCommand;