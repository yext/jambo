const fs = require('file-system');
const {
  parse,
  stringify,
  assign 
} = require('comment-json');

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
    const name = pageConfiguration.getName();
    const theme = pageConfiguration.getTheme();
    const template = pageConfiguration.getTemplate();
    const layout = pageConfiguration.getLayout();

    const htmlFilePath = `${this.config.dirs.pages}/${name}.html.hbs`;
    const configFilePath = `${this.config.dirs.config}/${name}.json`;

    let configContents = layout ? { layout } : {};
    if (theme && template) {
      const rootTemplatePath = 
        `${this.config.dirs.themes}/${theme}/templates/${template}`;
      fs.copyFileSync(`${rootTemplatePath}/page.html.hbs`, htmlFilePath);

      configContents = assign(
        parse(fs.readFileSync(`${rootTemplatePath}/page-config.json`, 'utf8')),
        configContents);
    } else {
      fs.writeFileSync(htmlFilePath, '');
    }
    fs.writeFileSync(configFilePath, stringify(configContents, null, 2));
  }
}