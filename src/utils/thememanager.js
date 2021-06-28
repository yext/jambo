const UserError = require('../errors/usererror');

const ThemeRepos = {
  'answers-hitchhiker-theme': 'https://github.com/yext/answers-hitchhiker-theme.git'
}

/**
 * Responsible for providing information about themes known by Jambo
 */
class ThemeManager {
  /**
   * Returns true if a theme name is known by Jambo
   *
   * @param {string} themeName 
   * @returns {boolean}
   */
  static isThemeKnown(themeName) {
    return (themeName in ThemeRepos);
  }

  /**
   * Returns an array of known themes
   * @returns {string[]}
   */
  static getKnownThemes() {
    return Object.keys(ThemeRepos);
  }

  /**
   * Gets the repo for a given theme name
   * 
   * @param {string} themeName The URL to a theme, or the name of a known theme.
   * @returns 
   */
  static getRepoForTheme(themeName) {
    if (!this.isThemeKnown(themeName)) {
      throw new UserError(`The theme ${themeName} is not known by Jambo.`);
    }
    return ThemeRepos[themeName];
  }
}

module.exports = ThemeManager;