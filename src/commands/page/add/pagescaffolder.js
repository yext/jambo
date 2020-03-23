const fs = require('file-system');

const scriptUtils = require('../../../utils/scriptrunner');

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

  async create(pageConfiguration) {
    try {
      const name = pageConfiguration.getName();
      const theme = pageConfiguration.getTheme();
      const template = pageConfiguration.getTemplate();
      const layout = pageConfiguration.getLayout();
  
      this._createFiles({ name, theme, template, layout });
      theme && await this._executeAddPageScript({ name, theme });
    } catch (error) {
      return Promise.reject(error.toString());
    }
  }

  _createFiles({ name, theme, template, layout }) {
    const htmlFilePath = `${this.config.dirs.pages}/${name}.html.hbs`;
    const configFilePath = `${this.config.dirs.config}/${name}.json`;

    let configContents = layout ? { layout } : {};
    if (theme && template) {
      const rootTemplatePath = `${this.config.dirs.themes}/${theme}/templates/${template}`;
      fs.copyFileSync(`${rootTemplatePath}/page.html.hbs`, htmlFilePath);

      configContents = Object.assign(
        {},
        JSON.parse(fs.readFileSync(`${rootTemplatePath}/page-config.json`)),
        configContents);
    } else {
      fs.writeFileSync(htmlFilePath, '');
    }
    fs.writeFileSync(configFilePath, JSON.stringify(configContents, null, 2));
  }

  _executeAddPageScript({ name, theme }) {
    const addPageScript = 
      `${this.config.dirs.themes}/${theme}/scripts/addPage.sh`;
    if (fs.existsSync(addPageScript)) {
      const scriptRunner = new scriptUtils.ScriptRunner(this.config);
      return scriptRunner.execute(addPageScript, { PAGE_NAME: name});
    }
  }
}