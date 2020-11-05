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
   * @param {Object} command an object containing a command's class and a way
   *                         to instantiate the class
   */
  addCommand(command) {
    this._commandsByName[command.clazz.getAlias()] = command;
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
        clazz: InitCommand, 
        factory: () => new InitCommand()
      },
      [ ThemeImporter.getAlias() ]: {
        clazz: ThemeImporter, 
        factory: jamboConfig => new ThemeImporter(jamboConfig)
      },
      [ PageCommand.getAlias() ]: {
        clazz: PageCommand, 
        factory: jamboConfig => new PageCommand(jamboConfig, pageScaffolder)
      },
      [ OverrideCommand.getAlias() ]: {
        clazz: OverrideCommand, 
        factory: jamboConfig => new OverrideCommand(jamboConfig)
      },
      [ BuildCommand.getAlias() ]: {
        clazz: BuildCommand, 
        factory: () => new BuildCommand(sitesGenerator)
      },
      [ ThemeUpgrader.getAlias() ]: {
        clazz: ThemeUpgrader, 
        factory: jamboConfig => new ThemeUpgrader(jamboConfig)
      },
      [ DescribeCommand.getAlias() ]: {
        clazz: DescribeCommand, 
        factory: jamboConfig => new DescribeCommand(
          jamboConfig, 
          () => this.getCommands())
      },
      [ JamboTranslationExtractor.getAlias() ]: {
        clazz: JamboTranslationExtractor, 
        factory: jamboConfig => new JamboTranslationExtractor(jamboConfig)
      }
    };
  }
}
module.exports = CommandRegistry;