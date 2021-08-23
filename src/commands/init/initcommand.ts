import { RepositorySettings, RepositoryScaffolder } from './repositoryscaffolder';
import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import ThemeManager from '../../utils/thememanager';
import Command from '../../models/commands/command';

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
const InitCommand : Command = class {
  static alias = 'init';
  static shortDescription = 'initialize the repository';
  static args: Record<string, ArgumentMetadata> = {
    themeUrl: {
      type: ArgumentType.STRING,
      description: 'url of a theme\'s git repo to import during the init',
    },
    theme: {
      type: ArgumentType.STRING,
      description: '(deprecated: specify the themeUrl instead)'
        + ' the name of a theme to import during the init',
      isRequired: false
    },
    useSubmodules: {
      type: ArgumentType.BOOLEAN, 
      description: 'if starter theme should be imported as submodule'
    }
  };

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

  async execute(args: Record<string, any>) {
    const repositorySettings = new RepositorySettings(args);
    const repositoryScaffolder = new RepositoryScaffolder();
    await repositoryScaffolder.create(repositorySettings);
  }
}

export default InitCommand;