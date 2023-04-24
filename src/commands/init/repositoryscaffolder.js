const ThemeImporter = require('../import/themeimporter');

const fs = require('file-system');
const process = require('process');
const simpleGit = require('simple-git');
const SystemError = require('../../errors/systemerror');
const git = simpleGit();

/**
 * RepositorySettings contains the information needed by Jambo to scaffold a new site
 * repository. Currently, these settings include an optional themeUrl, theme name, and
 * whether or not the theme should be imported as a submodule.
 */
exports.RepositorySettings = class {
  constructor({ themeUrl, theme, useSubmodules, includeTranslations }) {
    this._themeUrl = themeUrl;
    this._theme = theme;
    this._useSubmodules = useSubmodules;
    this._includeTranslations = includeTranslations;
  }

  getThemeUrl() {
    return this._themeUrl;
  }

  getTheme() {
    return this._theme;
  }

  shouldUseSubmodules() {
    return this._useSubmodules;
  }

  shouldIncludeTranslations() {
    return this._includeTranslations;
  }
}

exports.RepositoryScaffolder = class {
  /**
   * This method scaffolds a new site repository based on the provided RepositorySettings
   * object. The repository will include all directories needed by Jambo as well as the 
   * Git infrastructure needed for source control. If a theme is specified, that will 
   * also be imported.
   *
   * @param {RepositoryScaffolder} repositorySettings The settings for the new repository.
   */
  async create(repositorySettings) {
    try {
      const cwd = process.cwd();
      await git.cwd(cwd);
      await git.init();
      fs.writeFileSync('.gitignore', 'public/\nnode_modules/\n');

      const includeTranslations = 
        repositorySettings.shouldIncludeTranslations();
      this._createDirectorySkeleton(includeTranslations);
      const jamboConfig = this._createJamboConfig(includeTranslations);

      const themeUrl = repositorySettings.getThemeUrl();
      const theme = repositorySettings.getTheme();
      if (themeUrl || theme) {
        const themeImporter = new ThemeImporter(jamboConfig);
        await themeImporter.import(
          themeUrl,
          theme, 
          repositorySettings.shouldUseSubmodules());
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
  _createDirectorySkeleton(includeTranslations) {
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
  _createJamboConfig(includeTranslations) {
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
    if (includeTranslations) {
      jamboConfig.dirs.translations = 'translations';
    }

    fs.writeFileSync('jambo.json', JSON.stringify(jamboConfig, null, 2));

    return jamboConfig;
  }
};