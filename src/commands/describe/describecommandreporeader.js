const fs = require('fs');
const fileSystem = require('file-system');
const path = require('path');

/**
 * DescribeCommandRepoReader holds the filesystem logic used in the describe command.
 * TODO(SLAP-766): This class is temporary and will be removed when the built-in commands
 * are updated to use the Command interface.
 */
module.exports = class DescribeCommandRepoReader {
  constructor(jamboConfig) {
    this.themesDir = jamboConfig.dirs.themes;
    this.defaultTheme = jamboConfig.defaultTheme;
  }

  /**
   * @returns {Array<string>} the names of the available themes to be imported
   */
  getImportableThemes() {
    return ['answers-hitchhiker-theme'];
  }

  /**
   * @returns {Array<string>}
   */
  getPageTemplates() {
    if (!this.defaultTheme) {
      return [];
    }
    const pageTemplatesDir = path.resolve(this.themesDir, this.defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }

  /**
   * @returns {Array<string>} all theme files that can be overridden
   */
  getThemeFiles() {
    const themeFiles = []
    fileSystem.recurseSync(this.themesDir, function(filepath) {
      if (fs.statSync(filepath).isFile()) {
        themeFiles.push(filepath);
      }
    });
    return themeFiles;
  }

  /**
   * @returns {Array<string>} the names of the available cards
   */
  getCards() {
    if (!this.defaultTheme) {
      return [];
    }
    const cardsDir = path.resolve(this.themesDir, this.defaultTheme, 'cards');
    return fs.readdirSync(cardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);
  }

  /**
   * @returns {Array<string>} the names of the available direct answer cards
   */
  getDirectAnswerCards() {
    if (!this.defaultTheme) {
      return [];
    }
    const daCardsDir =
      path.resolve(this.themesDir, this.defaultTheme, 'directanswercards');
    return fs.readdirSync(daCardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);
  }
}