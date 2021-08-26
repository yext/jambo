import ThemeImporter from '../import/themeimporter';
import fs from 'file-system';
import process from 'process';
import simpleGit from 'simple-git/promise';
import SystemError from '../../errors/systemerror';
import { JamboConfig } from '../../models/JamboConfig';
const git = simpleGit();

/**
 * RepositorySettings contains the information needed by Jambo to scaffold a new site
 * repository. Currently, these settings include an optional themeUrl, theme name, and
 * whether or not the theme should be imported as a submodule.
 */
export interface RepositorySettings {
  themeUrl: string
  theme: string
  useSubmodules: boolean
  includeTranslations: boolean
}

export class RepositoryScaffolder {
  /**
   * This method scaffolds a new site repository based on the provided RepositorySettings
   * object. The repository will include all directories needed by Jambo as well as the 
   * Git infrastructure needed for source control. If a theme is specified, that will 
   * also be imported.
   *
   * @param {RepositorySettings} repositorySettings The settings for the new repository.
   */
  async create(repositorySettings: RepositorySettings) {
    try {
      const cwd = process.cwd();
      await git.cwd(cwd);
      await git.init();
      fs.writeFileSync('.gitignore', 'public/\nnode_modules/\n');

      const includeTranslations = 
        repositorySettings.includeTranslations;
      this._createDirectorySkeleton(includeTranslations);
      const jamboConfig = this._createJamboConfig(includeTranslations);

      const themeUrl = repositorySettings.themeUrl;
      const theme = repositorySettings.theme;
      if (themeUrl || theme) {
        const themeImporter = new ThemeImporter(jamboConfig);
        await themeImporter.execute({
          themeUrl,
          theme, 
          useSubmodules: repositorySettings.useSubmodules
        });
      }
    } catch (err) {
      throw new SystemError(err.message, err.stack);
    }
  }

  /**
   * Initialize pages, config, themes, partials, and public directories.
   * Optionally initializes a translations directory as well.
   * 
   * @param {boolean} includeTranslations Whether or not a translations directory
   *                                      should be included.
   */
  _createDirectorySkeleton(includeTranslations: boolean) {
    fs.mkdirSync('pages');
    fs.mkdirSync('config');
    fs.mkdirSync('partials');
    fs.mkdirSync('themes');
    fs.mkdirSync('public');
    includeTranslations && fs.mkdirSync('translations');
  }

  /**
   * Create the top-level Jambo config which indicates the paths to the various
   * directories needed by Jambo.
   *
   * @param {boolean} includeTranslations Whether or not a translations directory
   *                                      should be included in the config.
   * @returns {Object} The constructed config.
   */
  _createJamboConfig(includeTranslations: boolean) {
    const jamboConfig: JamboConfig = {
      dirs: {
        themes: 'themes',
        config: 'config',
        output: 'public',
        pages: 'pages',
        partials: ['partials'],
        preservedFiles: []
      }
    };
    if (includeTranslations) {
      jamboConfig.dirs.translations = 'translations';
    }

    fs.writeFileSync('jambo.json', JSON.stringify(jamboConfig, null, 2));

    return jamboConfig;
  }
}
