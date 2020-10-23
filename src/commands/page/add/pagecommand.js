const fs = require('fs');
const path = require('path');
const { PageConfiguration, PageScaffolder } = require ('./pagescaffolder');
const { ArgumentMetadata, ArgumentType } = require('../../../models/commands/argumentmetadata');

/**
 * PageCommand registers a new page with the specified name to be built by Jambo.
 */
class PageCommand {
  constructor(jamboConfig = {}) {
    this.jamboConfig = jamboConfig;
    this.themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    this.defaultTheme = jamboConfig.defaultTheme;
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
      layout: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'layout to use with page',
        isRequired: false
      }),
      template: new ArgumentMetadata({
        type: ArgumentType.STRING,
        description: 'template to use within theme',
        isRequired: false
      })
    }
  }

  describe() {
    const pageTemplates = this._getPageTemplates();
    const pageLayouts = this._getPageLayouts();
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
        layout: {
          displayName: 'Page Layout',
          type: 'singleoption',
          options: pageLayouts
        }
      }
    }
  }

  /**
   * @returns {Array<string>}
   */
  _getPageTemplates() {
    if (!this.defaultTheme || !this.themesDir) {
      return [];
    }
    const pageTemplatesDir = path.resolve(this.themesDir, this.defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }

  /**
   * @returns {Array<string>}
   */
  _getPageLayouts() {
    if (!this.defaultTheme || !this.themesDir) {
      return [];
    }
    const pageLayoutDir = path.resolve(this.themesDir, this.defaultTheme, 'layouts');
    return fs.readdirSync(pageLayoutDir);
  }

  execute(args) {
    const pageConfiguration = new PageConfiguration(
      { ...args, theme: this.defaultTheme });
    const pageScaffolder = new PageScaffolder(this.jamboConfig);
    try {
      pageScaffolder.create(pageConfiguration);
    } catch (err) {
      throw new UserError('Failed to add page', err.stack);
    }
  }
}

module.exports = PageCommand;