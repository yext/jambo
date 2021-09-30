import { RepositoryScaffolder, RepositorySettings } from './repositoryscaffolder';
import ThemeManager from '../../utils/thememanager';
import Command from '../../models/commands/Command';
import { BooleanMetadata, StringMetadata } from '../../models/commands/concreteargumentmetadata';
import DescribeMetadata from '../../models/commands/DescribeMetadata';

const args = {
  themeUrl: new StringMetadata({
    description: 'url of a theme\'s git repo to import during the init',
  }),
  theme: new StringMetadata({
    description: '(deprecated: specify the themeUrl instead)'
      + ' the name of a theme to import during the init',
    isRequired: false
  }),
  useSubmodules: new BooleanMetadata({
    description: 'if starter theme should be imported as submodule'
  }),
  includeTranslations: new BooleanMetadata({
    description: 'if a translations directory should be included'
  })
};

/**
 * InitCommand initializes the current directory as a Jambo repository.
 */
const InitCommand: Command<typeof args> = class {
  static getAlias() {
    return 'init';
  }

  static getShortDescription() {
    return 'initialize the repository';
  }

  static args() {
    return args;
  }

  static describe(): DescribeMetadata<typeof args> {
    const importableThemes = ThemeManager.getKnownThemes();
    return {
      displayName: 'Initialize Jambo',
      params: {
        themeUrl: {
          displayName: 'URL'
        },
        theme: {
          displayName: 'Theme',
          type: 'singleoption',
          options: importableThemes
        },
        useSubmodules: {
          displayName: 'Use Submodules'
        },
        includeTranslations: {
          displayName: 'Include Translations'
        }
      }
    };
  }

  async execute(args: RepositorySettings) {
    const repositoryScaffolder = new RepositoryScaffolder();
    await repositoryScaffolder.create(args);
  }
};

export default InitCommand;