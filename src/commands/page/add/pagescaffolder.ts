import fs from 'file-system';
import { parse, stringify } from 'comment-json';
import { JamboConfig } from '../../../models/JamboConfig';
import PageConfiguration from './pageconfiguration';

class PageScaffolder {
  config: JamboConfig

  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  create(pageConfiguration: PageConfiguration) {
    const name = pageConfiguration.name;
    const theme = pageConfiguration.theme;
    const template = pageConfiguration.template;
    const locales = pageConfiguration.locales;

    const htmlFilePath = `${this.config.dirs.pages}/${name}.html.hbs`;
    const configFilePath = `${this.config.dirs.config}/${name}.json`;

    let configContents = {};
    if (theme && template) {
      const rootTemplatePath =
        `${this.config.dirs.themes}/${theme}/templates/${template}`;
      fs.copyFileSync(`${rootTemplatePath}/page.html.hbs`, htmlFilePath);

      configContents = parse(fs.readFileSync(`${rootTemplatePath}/page-config.json`, 'utf8'));
    } else {
      fs.writeFileSync(htmlFilePath, '');
    }
    fs.writeFileSync(configFilePath, stringify(configContents, null, 2));

    if (locales) {
      locales.forEach(locale => this._createConfigForLocale(name, locale));
    }
  }

  _createConfigForLocale(name, locale) {
    const configFilePath = `${this.config.dirs.config}/${name}.${locale}.json`;
    fs.writeFileSync(configFilePath, '{}');
  }
}
export default PageScaffolder;