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
      })
    }
  }

  describe() {
    const pageTemplates = this._getPageTemplates();
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