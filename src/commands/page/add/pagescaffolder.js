const fs = require('file-system');
const {
  parse,
  stringify,
  assign 
} = require('comment-json');

class PageScaffolder {
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
module.exports = PageScaffolder;