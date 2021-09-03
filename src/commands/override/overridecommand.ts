import fs from 'fs';
import path from 'path';
import fileSystem from 'file-system';
import { ShadowConfiguration, ThemeShadower } from './themeshadower';
import { JamboConfig } from '../../models/JamboConfig';
import Command from '../../models/commands/command';
import { StringMetadata } from '../../models/commands/concreteargumentmetadata';

const args = {
  path: new StringMetadata({
    description: 'path in the theme to override',
    isRequired: true
  })
};

/**
 * OverrideCommand overrides a specific file in the theme.
 */
const OverrideCommand: Command<typeof args> = class {
  jamboConfig: JamboConfig;
  defaultTheme: string;

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
    return args;
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
   * @returns all theme files that can be overridden
   */
  static _getThemeFiles(jamboConfig): string[] {
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

  execute(args: { path: string }) {
    const shadowConfiguration = new ShadowConfiguration(
      { ...args, theme: this.defaultTheme });
    const themeShadower = new ThemeShadower(this.jamboConfig);
    themeShadower.createShadow(shadowConfiguration);
  }
}

export default OverrideCommand;