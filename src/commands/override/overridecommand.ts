import fs from 'fs';
import path from 'path';
import fileSystem from 'file-system';
import { ShadowConfiguration, ThemeShadower } from './themeshadower';
import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import { JamboConfig } from '../../models/JamboConfig';

/**
 * OverrideCommand overrides a specific file in the theme.
 */
class OverrideCommand {
  jamboConfig: JamboConfig
  defaultTheme: string

  constructor(jamboConfig: JamboConfig = {}) {
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
   * @returns {string[]} all theme files that can be overridden
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

export default OverrideCommand;