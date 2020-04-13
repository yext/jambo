const fs = require('fs-extra');

/**
 * The ShadowConfiguration specifies what file(s) should be shadowed for a particular theme.
 * The configuration consists of a theme and an optional path within the theme. If the path is
 * specified, only those files within the theme will be shadowed. Otherwise, all files in the theme
 * will be shadowed.
 */
exports.ShadowConfiguration = class {
  constructor({ theme, path }) {
    if (!theme) {
      throw new Error('Theme must be specified when shadowing');
    }

    this._theme = theme;
    this._path = path;
  }

  getTheme() {
    return this._theme;
  }

  getPath() {
    return this._path;
  }
};

/**
 * The ThemeShadower takes a ShadowConfiguration and produces the necessary shadows. These shadows
 * are copies of the original files and will take precedence over them when registering partials.
 * This allows the convenient override of bits and pieces of a theme.
 */
exports.ThemeShadower = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  createShadow(shadowConfiguration) {
    const theme = shadowConfiguration.getTheme();
    const path = shadowConfiguration.getPath();

    let relativeShadowDir = theme;
    if (path) {
      relativeShadowDir = `${relativeShadowDir}/${path}`;
    }
    const sourceDir = `${this.config.dirs.themes}/${relativeShadowDir}`;
    const isShadowingFile = fs.lstatSync(sourceDir).isFile();

    let fullShadowDir = `${this.config.dirs.overrides}/${relativeShadowDir}`;
    if (isShadowingFile) {
      fs.mkdirSync(fullShadowDir.substring(0, fullShadowDir.lastIndexOf('/')), { recursive: true })
    } else {
      fs.mkdirSync(fullShadowDir, { recursive: true });
    }

    fs.copySync(sourceDir, fullShadowDir);
  }
};