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
    this._commandsByName[command.getAlias()] = command;
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
   * override, build, and upgrade.
   *
   * @returns {Map<string, Command>} The built-in commmands, keyed by name.
   */
  _initialize() {
    const initCommand = new InitCommand();
    const importCommand = new ThemeImporter(this._jamboConfig);
    const pageScaffolder = new PageScaffolder(this._jamboConfig);
    const pageCommand = new PageCommand(this._jamboConfig, pageScaffolder);
    const overrideCommand = new OverrideCommand(this._jamboConfig);
    const sitesGenerator = new SitesGenerator(this._jamboConfig);
    const buildCommand = new BuildCommand(sitesGenerator);
    const upgradeCommand = new ThemeUpgrader(this._jamboConfig);
    const describeCommand =
      new DescribeCommand(() => this.getCommands());
    const extractTranslationsCommand =
      new JamboTranslationExtractor(this._jamboConfig);
    return {
      [ initCommand.getAlias() ]: initCommand,
      [ importCommand.getAlias() ]: importCommand,
      [ pageCommand.getAlias() ]: pageCommand,
      [ overrideCommand.getAlias() ]: overrideCommand,
      [ buildCommand.getAlias() ]: buildCommand,
      [ upgradeCommand.getAlias() ]: upgradeCommand,
      [ describeCommand.getAlias() ]: describeCommand,
      [ extractTranslationsCommand.getAlias() ]: extractTranslationsCommand
    };
  }
}
module.exports = CommandRegistry;