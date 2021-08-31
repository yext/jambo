import { RepositoryScaffolder } from './repositoryscaffolder';
import ThemeManager from '../../utils/thememanager';
import Command, { ArgsForExecute } from '../../models/commands/command';

const args = {
  themeUrl: {
    type: 'string',
    description: 'url of a theme\'s git repo to import during the init',
  },
  theme: {
    type: 'string',
    description: '(deprecated: specify the themeUrl instead)'
      + ' the name of a theme to import during the init',
    isRequired: false
  },
  useSubmodules: {
    type: 'boolean', 
    description: 'if starter theme should be imported as submodule'
  },
  includeTranslations: {
    type: 'boolean', 
    description: 'if a translations directory should be included'
  }
} as const;
type Args = typeof args;
type ExecArgs = ArgsForExecute<Args>;

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
const InitCommand : Command<Args, ExecArgs> = class {
  static getAlias() {
    return 'init';
  }

  static getShortDescription() {
    return 'initialize the repository';
  }

  static args() {
    return args;
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
        },
        includeTranslations: {
          displayName: 'Include Translations',
          type: 'boolean'
        },
      }
    }
  }

  async execute(args: ArgsForExecute<Args>) {
    const repositoryScaffolder = new RepositoryScaffolder();
    await repositoryScaffolder.create(args);
  }
}

export default InitCommand;