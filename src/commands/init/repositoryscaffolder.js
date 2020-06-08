const themeCommand = require('../import/themeimporter');

const fs = require('file-system');
const simpleGit = require('simple-git/promise');
const git = simpleGit();

/**
 * RepositorySettings contains the information needed by Jambo to scaffold a new site repository.
 * Currently, these settings include an optional theme and whether or not the theme should be
 * imported as a submodule.
 */
exports.RepositorySettings = class {
  constructor({ theme, addThemeAsSubmodule }) {
    this._theme = theme;
    this._addThemeAsSubmodule = addThemeAsSubmodule;
  }

  getTheme() {
    return this._theme;
  }

  shouldAddThemeAsSubmodule() {
    return this._addThemeAsSubmodule;
  }
}

exports.RepositoryScaffolder = class {
  /**
   * This method scaffolds a new site repository based on the provided RepositorySettings object.
   * The repository will include all directories needed by Jambo as well as the Git infrastructure
   * needed for source control. If a theme is specified, that will also be imported.
   *
   * @param {RepositoryScaffolder} repositorySettings The settings for the new repository.
   */
  async create(repositorySettings) {
    try {
      await git.init();
      fs.writeFileSync('.gitignore', 'public/\nnode_modules/\n');

      this._createDirectorySkeleton();
      const jamboConfig = this._createJamboConfig();

      const theme = repositorySettings.getTheme();
      if (theme) {
        const themeImporter = new themeCommand.ThemeImporter(jamboConfig);
        await themeImporter.import(
          theme, 
          repositorySettings.shouldAddThemeAsSubmodule());
      }
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  /**
   * Initialize pages, config, themes, partials, and public directories.
   */
  _createDirectorySkeleton() {
    fs.mkdirSync('pages');
    fs.mkdirSync('config');
    fs.mkdirSync('partials');
    fs.mkdirSync('themes');
    fs.mkdirSync('public');
  }

  /**
   * Create the top-level Jambo config which indicates the paths to the various directories
   * needed by Jambo.
   *
   * @returns {Object} The constructed config.
   */
  _createJamboConfig() {
    const jamboConfig = {
      dirs: {
        themes: 'themes',
        config: 'config',
        output: 'public',
        pages: 'pages',
        partials: ['partials'],
        preservedFiles: []
      }
    };
    fs.writeFileSync('jambo.json', JSON.stringify(jamboConfig, null, 2));

    return jamboConfig;
  }
};