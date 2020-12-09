const fs = require('file-system');
const { addToPartials } = require('../../utils/jamboconfigutils');
const UserError = require('../../errors/usererror');

/**
 * The ShadowConfiguration specifies what file(s) should be shadowed for a particular
 * theme. The configuration consists of a theme and a path within the theme. The path 
 * indicates which file(s) in the Theme should have local shadows.
 */
exports.ShadowConfiguration = class {
  constructor({ theme, path }) {
    if (!theme || !path) {
      throw new UserError('Theme and path must be specified when shadowing');
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
 * The ThemeShadower takes a ShadowConfiguration and produces the necessary shadows. 
 * These shadows are copies of the original files and will take precedence over them 
 * when registering partials. This allows the convenient override of bits and 
 * pieces of a theme.
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

    try {
      this._createShadowDir(fullPathInThemes, path);
    } catch (err) {
      throw new UserError('Override failed', err.stack);
    }
    
    addToPartials(path);
  }

  /**
   * Creates the necessary local directories for the provided shadow. If the
   * shadow corresponds to a top-level file, no new directories will be created.
   *
   * @param {string} fullPathInThemes The path inside the theme
   * @param {string} localShadowPath The path of the new, local shadow.
   */
  _createShadowDir(fullPathInThemes, localShadowPath) {
    if (fs.lstatSync(fullPathInThemes).isFile()) {
      fs.copyFileSync(fullPathInThemes, localShadowPath);
    } else if (fs.lstatSync(fullPathInThemes).isDirectory()) {
      fs.recurseSync(fullPathInThemes, (path, relative, filename) => {
        if (fs.lstatSync(path).isFile()) {
          fs.copyFileSync(path, `${localShadowPath}/${relative}`);
        } else {
          fs.mkdirSync(`${localShadowPath}/${relative}`);
        }
      });
    }
  }
};