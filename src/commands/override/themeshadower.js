const fs = require('fs-extra');
const path = require('path');
const { addToPartials } = require('../../utils/jamboconfigutils');

/**
 * The ShadowConfiguration specifies what file(s) should be shadowed for a particular theme.
 * The configuration consists of a theme and a path within the theme. The path indicates which
 * file(s) in the Theme should have local shadows.
 */
exports.ShadowConfiguration = class {
  constructor({ theme, path }) {
    if (!theme || !path) {
      throw new Error('Theme and path must be specified when shadowing');
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

    const pathToTheme = `${this.config.dirs.themes}/${theme}`;
    const fullPathInThemes = `${pathToTheme}/${path}`;

    const isShadowingFile = fs.lstatSync(fullPathInThemes).isFile();
    this._createShadowDir(isShadowingFile, path);
    fs.copySync(fullPathInThemes, path);
    addToPartials(path);
  }

  /**
   * Creates the necessary local directories for the provided shadow. If the
   * shadow corresponds to a top-level file, no new directories will be created.
   * 
   * @param {boolean} isFile If the shadow corresponds to a single file.
   * @param {string} localShadowPath The path of the new, local shadow.
   */
  _createShadowDir(isFile, localShadowPath) {
    if (isFile && localShadowPath.includes(path.sep)) {
      fs.mkdirSync(
        localShadowPath.substring(0, localShadowPath.lastIndexOf(path.sep)), 
        { recursive: true });
    } else if (!isFile) {
      fs.mkdirSync(localShadowPath, { recursive: true });
    }
  }
};