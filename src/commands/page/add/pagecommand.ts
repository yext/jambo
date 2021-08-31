import fs from 'fs';
import path from 'path';
import { parse } from 'comment-json';
import UserError from '../../../errors/usererror';
import { JamboConfig } from '../../../models/JamboConfig';
import PageScaffolder from './pagescaffolder';
import Command, { ArgsForExecute } from '../../../models/commands/command';

const args = {
  name: {
    type: 'string',
    description: 'name for the new files',
    isRequired: true
  },
  template: {
    type: 'string',
    description: 'template to use within theme',
    isRequired: false
  },
  locales: {
    type: 'array',
    itemType: 'string',
    description: 'additional locales to generate the page for',
    isRequired: false
  }
} as const;
type Args = typeof args;
type ExecArgs = ArgsForExecute<Args>;

/**
 * PageCommand registers a new page with the specified name to be built by Jambo.
 */
const PageCommand : Command<Args, ExecArgs> = class {
  jamboConfig: JamboConfig;
  defaultTheme: string;
  pageScaffolder: PageScaffolder;

  constructor(jamboConfig: JamboConfig = {}, pageScaffolder) {
    this.jamboConfig = jamboConfig;
    this.defaultTheme = jamboConfig?.defaultTheme;
    this.pageScaffolder = pageScaffolder;
  }

  static getAlias() {
    return 'page';
  }

  static getShortDescription() {
    return 'add a new page to the site';
  }

  static args() {
    return args;
  }

  static describe(jamboConfig) {
    const pageTemplates = this._getPageTemplates(jamboConfig);
    const pageLocales = this._getAdditionalPageLocales(jamboConfig);
    return {
      displayName: 'Add Page',
      params: {
        name: {
          displayName: 'Page Name',
          type: 'string',
          required: true
        },
        template: {
          displayName: 'Page Template',
          type: 'singleoption',
          options: pageTemplates
        },
        locales: {
          displayName: 'Additional Page Locales',
          type: 'multioption',
          options: pageLocales
        }
      }
    }
  }

  /**
   * @returns {string[]} The page templates available in the theme
   */
  static _getPageTemplates(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const currDirectory = process.cwd();
    const pageTemplatesDir = 
      path.resolve(currDirectory, themesDir, defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }
  
  /**
   * @returns {string[]} The additional locales that are configured in 
   *                          locale_config.json
   */
  static _getAdditionalPageLocales(jamboConfig) {
    if (!jamboConfig) {
      return [];
    }

    const configDir = jamboConfig.dirs.config;
    if (!configDir) {
      return [];
    }

    const localeConfig = path.resolve(configDir, 'locale_config.json');
    if (!fs.existsSync(localeConfig)) {
      return [];
    }

    const pageLocales = [];
    const localeContentsRaw = fs.readFileSync(localeConfig, 'utf-8');
    let localeContentsJson;
    try {
      localeContentsJson = parse(localeContentsRaw);
    } catch(err) {
      throw new UserError('Could not parse locale_config.json ', err.stack);
    }
    const defaultLocale = localeContentsJson.default;
    for (const locale in localeContentsJson.localeConfig) {
      // don't list the default locale as an option
      if (locale !== defaultLocale) {
        pageLocales.push(locale);
      }
    }
    return pageLocales;
  }

  execute(args: ExecArgs) {
    const pageConfiguration = { ...args, theme: this.defaultTheme };
    try {
      this.pageScaffolder.create(pageConfiguration);
    } catch (err) {
      throw new UserError('Failed to add page', err.stack);
    }
  }
}

export default PageCommand;