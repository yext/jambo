const fs = require('fs');
const fileSystem = require('file-system');
const path = require('path');

module.exports = class RepoAnalyzer {
  constructor(jamboConfig) {
    this.themesDir = jamboConfig.dirs.themes;
    this.defaultTheme = jamboConfig.defaultTheme;
  }

  getThemes() {
    return ['answers-hitchhiker-theme'];
  }

  getPageTemplates() {
    const pageTemplatesDir = path.resolve(this.themesDir, this.defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }

  getThemeFiles() {
    const themeFiles = []
    fileSystem.recurseSync(this.themesDir, function(filepath) {
      if (fs.statSync(filepath).isFile()) {
        themeFiles.push(filepath);
      }
    });
    return themeFiles;
  }

  getCards() {
    const cardsDir = path.resolve(this.themesDir, this.defaultTheme, 'cards');
    return fs.readdirSync(cardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);
  }

  getDirectAnswerCards() {
    const daCardsDir =
      path.resolve(this.themesDir, this.defaultTheme, 'directanswercards');
    return fs.readdirSync(daCardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);
  }
}