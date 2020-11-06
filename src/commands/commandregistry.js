const InitCommand = require('../commands/init/initcommand');
const PageCommand = require('./page/add/pagecommand');
const OverrideCommand = require('./override/overridecommand');
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
   * Registers a new {@link Command} class with the CLI.
   *
   * @param {Class} commandClazz 
   */
  addCommand(commandClazz) {
    this._commandsByName[commandClazz.getAlias()] = commandClazz;
  }

  /**
   * @param {string} name The command's alias.
   * @returns {Class} The {@link Command} class with the provided alias.
   */
  getCommand(name) {
    return this._commandsByName[name];
  }

  /**
   * @returns {Array<Class>} All {@link Command} classes registered with Jambo.
   */
  getCommands() {
    return Object.values(this._commandsByName);
  }

  /**
   * Initializes the registry with classes of built-in Jambo commands: init, import, page,
   * override, build, upgrade, describe, and extract-tranlations.
   *
   * @returns {Map<string, Command>} The built-in commmands' classes, keyed by name.
   */
  _initialize() {
    return {
      [ InitCommand.getAlias() ]: InitCommand,
      [ ThemeImporter.getAlias() ]: ThemeImporter,
      [ PageCommand.getAlias() ]: PageCommand,
      [ OverrideCommand.getAlias() ]: OverrideCommand,
      [ BuildCommand.getAlias() ]: BuildCommand,
      [ ThemeUpgrader.getAlias() ]: ThemeUpgrader,
      [ DescribeCommand.getAlias() ]: DescribeCommand,
      [ JamboTranslationExtractor.getAlias() ]: JamboTranslationExtractor
    };
  }
}
module.exports = CommandRegistry;