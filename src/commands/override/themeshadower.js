const fs = require('fs-extra');

exports.ShadowConfiguration = class {
  constructor({ theme, template, component }) {
    this._theme = theme;
    this._template = template;
    this._component = component;
  }

  getTheme() {
    return this._theme;
  }

  getTemplate() {
    return this._template;
  }

  getComponent() {
    return this._component;
  }
};

exports.ThemeShadower = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  createShadow(shadowConfiguration) {
    const theme = shadowConfiguration.getTheme();
    const template = shadowConfiguration.getTemplate();
    const component = shadowConfiguration.getComponent();

    let relativeShadowDir = theme;
    if (template) {
      relativeShadowDir = `${relativeShadowDir}/templates/${template}`;
    }
    const fullShadowDir = `${this.config.dirs.overrides}/${relativeShadowDir}`;
    fs.mkdirSync(fullShadowDir, { recursive: true });

    const sourceDir = `${this.config.dirs.themes}/${relativeShadowDir}`;

    if (component) {
      this._shadowComponentFile('markup', component, fullShadowDir, sourceDir);
      this._shadowComponentFile('script', component, fullShadowDir, sourceDir);
    } else {
      fs.copySync(sourceDir, fullShadowDir);
    }
  }

  _shadowComponentFile(fileType, component, shadowDir, sourceDir) {
    const fileShadowDir = `${shadowDir}/${fileType}`;
      fs.mkdirSync(fileShadowDir);
      fs.copyFileSync(
        `${sourceDir}/${fileType}/${component}.hbs`,
        `${fileShadowDir}/${component}.hbs`);
  }
};