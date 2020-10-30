const fs = require('fs');
const fileSystem = require('file-system');
const { ShadowConfiguration, ThemeShadower } = require('./themeshadower');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');

/**
 * OverrideCommand overrides a specific file in the theme.
 */
class OverrideCommand {
  constructor(jamboConfig = {}) {
    this.jamboConfig = jamboConfig;
    this.themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    this.defaultTheme = jamboConfig.defaultTheme;
  }

  getAlias() {
    return 'override';
  }

  getShortDescription() {
    return 'override a path within the theme';
  }

  args() {
    return{
      path: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'path in the theme to override',
        isRequired: true
      })
    }
  }

  describe() {
    const themeFiles = this._getThemeFiles();
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
  _getThemeFiles() {
    if (!this.themesDir) {
      return [];
    }
    const themeFiles = []
    fileSystem.recurseSync(this.themesDir, function(filepath) {
      if (fs.statSync(filepath).isFile()) {
        themeFiles.push(filepath);
      }
    });
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