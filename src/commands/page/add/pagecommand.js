const fs = require('fs');
const path = require('path');
const PageConfiguration = require ('./pageconfiguration');
const UserError = require('../../../errors/usererror');
const { ArgumentMetadata, ArgumentType } = require('../../../models/commands/argumentmetadata');

/**
 * PageCommand registers a new page with the specified name to be built by Jambo.
 */
class PageCommand {
  constructor(jamboConfig = {}, pageScaffolder) {
    this.jamboConfig = jamboConfig;
    this.themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    this.defaultTheme = jamboConfig.defaultTheme;
    this.pageScaffolder = pageScaffolder;
  }

  getAlias() {
    return 'page';
  }

  getShortDescription() {
    return 'add a new page to the site';
  }

  args() {
    return {
      name: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'name for the new files',
        isRequired: true
      }),
      template: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'template to use within theme',
        isRequired: false
      }),
      locales: new ArgumentMetadata({
        type: ArgumentType.ARRAY,
        itemType: ArgumentType.STRING,
        description: 'locales the page should support',
        isRequired: false
      })
    }
  }

  describe() {
    const pageTemplates = this._getPageTemplates();
    const pageLocales = this._getPageLocales();
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
          displayName: 'Page Locales',
          type: 'multioption',
          options: pageLocales
        }
      }
    }
  }

  /**
   * @returns {Array<string>} The page templates available in the theme
   */
  _getPageTemplates() {
    if (!this.defaultTheme || !this.themesDir) {
      return [];
    }
    const pageTemplatesDir = path.resolve(this.themesDir, this.defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }
  
  /**
   * @returns {Array<string>} The locales that are configured in locale_configs.json
   */
  _getPageLocales() {
    const configDir = this.jamboConfig.dirs.config;
    const localeConfig = path.resolve(configDir, 'locale_config.json');
    if (!configDir || ! localeConfig) {
      return [];
    }

    const pageLocales = [];
    const localeContentsRaw = fs.readFileSync(localeConfig);
    const localeContentsJson = JSON.parse(localeContentsRaw);
    for (const locale in localeContentsJson.localeConfig) {
      // a page has 'en' locale by default, so it won't be listed as an option
      if (locale !== 'en') {
        pageLocales.push(locale);
      }
    }
    return pageLocales;
  }

  execute(args) {
    const pageConfiguration = new PageConfiguration(
      { ...args, theme: this.defaultTheme });
    try {
      this.pageScaffolder.create(pageConfiguration);
    } catch (err) {
      throw new UserError('Failed to add page', err.stack);
    }
  }
}

module.exports = PageCommand;