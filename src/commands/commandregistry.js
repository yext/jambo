const InitCommand = require('../commands/init/initcommand');
const PageScaffolder = require('./page/add/pagescaffolder');
const PageCommand = require('./page/add/pagecommand');
const OverrideCommand = require('./override/overridecommand');
const SitesGenerator = require('./build/sitesgenerator');
const BuildCommand = require('./build/buildcommand');
const DescribeCommand = require('../commands/describe/describecommand');
const JamboTranslationExtractor = require('./extract-translations/jambotranslationextractor');
const ThemeImporter = require('./import/themeimporter');
const ThemeUpgrader = require('./upgrade/themeupgrader');

/**
 * A registry that maintains the built-in and custom commands for the Jambo CLI.
 */
class CommandRegistry {
  constructor(jamboConfig) {
    this._jamboConfig = jamboConfig;
    this._commandsByName = this._initialize();
  }

  /**
   * Registers a new {@link Command} with the CLI.
   *
   * @param {string} name
   * @param {Command} command
   */
  addCommand(command) {
    this._commandsByName[command.obj.getAlias()] = command;
  }

  /**
   * @param {string} name The command's alias.
   * @returns {Command} The {@link Command} with the provided alias.
   */
  getCommand(name) {
    return this._commandsByName[name];
  }

  /**
   * @returns {Array<Command>} All {@link Command}s registered with Jambo.
   */
  getCommands() {
    return Object.values(this._commandsByName);
  }

  /**
   * Initializes the registry with the built-in Jambo commands: init, import, page,
   * override, build, upgrade, describe, and extract-tranlations.
   *
   * @returns {Map<string, Command>} The built-in commmands, keyed by name.
   */
  _initialize() {
    const pageScaffolder = new PageScaffolder(this._jamboConfig);
    const sitesGenerator = new SitesGenerator(this._jamboConfig);
    return {
      [ InitCommand.getAlias() ]: {
        obj: InitCommand, 
        constructor: () => new InitCommand()
      },
      [ ThemeImporter.getAlias() ]: {
        obj: ThemeImporter, 
        constructor: jamboConfig => new ThemeImporter(jamboConfig)
      },
      [ PageCommand.getAlias() ]: {
        obj: PageCommand, 
        constructor: jamboConfig => new PageCommand(jamboConfig, pageScaffolder)
      },
      [ OverrideCommand.getAlias() ]: {
        obj: OverrideCommand, 
        constructor: jamboConfig => new OverrideCommand(jamboConfig)
      },
      [ BuildCommand.getAlias() ]: {
        obj: BuildCommand, 
        constructor: () => new BuildCommand(sitesGenerator)
      },
      [ ThemeUpgrader.getAlias() ]: {
        obj: ThemeUpgrader, 
        constructor: jamboConfig => new ThemeUpgrader(jamboConfig)
      },
      [ DescribeCommand.getAlias() ]: {
        obj: DescribeCommand, 
        constructor: jamboConfig => new DescribeCommand(
          jamboConfig, 
          () => this.getCommands())
      },
      [ JamboTranslationExtractor.getAlias() ]: {
        obj: JamboTranslationExtractor, 
        constructor: jamboConfig => new JamboTranslationExtractor(jamboConfig)
      }
    };
  }
}
module.exports = CommandRegistry;