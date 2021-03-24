const fs = require('fs');
const path = require('path');
const fileSystem = require('file-system');
const { ShadowConfiguration, ThemeShadower } = require('./themeshadower');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');

/**
 * OverrideCommand overrides a specific file in the theme.
 */
class OverrideCommand {
  constructor(jamboConfig = {}) {
    this.jamboConfig = jamboConfig;
    this.defaultTheme = jamboConfig.defaultTheme;
  }

  static getAlias() {
    return 'override';
  }

  static getShortDescription() {
    return 'override a path within the theme';
  }

  static args() {
    return{
      path: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'path in the theme to override',
        isRequired: true
      })
    }
  }

  static describe(jamboConfig) {
    const themeFiles = this._getThemeFiles(jamboConfig);
    return {
      displayName: 'Override Theme',
      params: {
        path: {
          displayName: 'Path to Override',
          type: 'filesystem',
          required: true,
          options: themeFiles
        }
      }
    }
  }

  /**
   * @returns {Array<string>} all theme files that can be overridden
   */
  static _getThemeFiles(jamboConfig) {
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    const defaultTheme = jamboConfig.defaultTheme;

    if (!themesDir || !defaultTheme) {
      return [];
    }
    const themeFiles = []
    fileSystem.recurseSync(
      path.join(themesDir, defaultTheme), 
      function(filepath, relative) {
        if (fs.statSync(filepath).isFile()) {
          themeFiles.push(relative);
        }
      }
    );
    return themeFiles;
  }

  execute(args) {
    const shadowConfiguration = new ShadowConfiguration(
      { ...args, theme: this.defaultTheme });
    const themeShadower = new ThemeShadower(this.jamboConfig);
    themeShadower.createShadow(shadowConfiguration);
  }
}

module.exports = OverrideCommand;