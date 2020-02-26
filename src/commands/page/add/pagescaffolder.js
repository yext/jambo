const fs = require('file-system');

exports.PageConfiguration = class {
  constructor({ name, layout, theme, template }) {
    this._name = name;
    this._layout = layout;
    this._theme = theme;
    this._template = template;
  }

  getName() {
    return this._name;
  }

  getLayout() {
    return this._layout;
  }

  getTheme() {
    return this._theme;
  }

  getTemplate() {
    return this._template;
  }
}

exports.PageScaffolder = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  create(pageConfiguration) {
    this._generateConfigFile(pageConfiguration);
    this._generateHTMLFile(pageConfiguration);
  }

  _generateConfigFile(pageConfiguration) {
    const configFilePath = `${this.config.dirs.config}/${pageConfiguration.getName()}.json`;
    const configObject =
      pageConfiguration.getLayout() ? { layout: `${pageConfiguration.getLayout()}.hbs` } : {};
    fs.writeFileSync(configFilePath, JSON.stringify(configObject));
  }

  _generateHTMLFile(pageConfiguration) {
    const htmlFilePath = `${this.config.dirs.pages}/${pageConfiguration.getName()}.html.hbs`;
    const theme = pageConfiguration.getTheme();
    const template = pageConfiguration.getTemplate();

    if (theme && template) {
      const rootTemplatePath =
        `${this.config.dirs.themes}/${theme}/templates/${template}/page.html.hbs`;
      fs.copyFileSync(rootTemplatePath, htmlFilePath);
    } else {
      fs.writeFileSync(htmlFilePath, '');
    }
  }
}