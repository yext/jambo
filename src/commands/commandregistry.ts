import InitCommand from '../commands/init/initcommand';
import PageCommand from './page/add/pagecommand';
import OverrideCommand from './override/overridecommand';
import BuildCommand from './build/buildcommand';
import DescribeCommand from '../commands/describe/describecommand';
import JamboTranslationExtractor from './extract-translations/jambotranslationextractor';
import ThemeImporter from './import/themeimporter';
import ThemeUpgrader from './upgrade/themeupgrader';
import Command from '../models/commands/command';

/**
 * A registry that maintains the built-in and custom commands for the Jambo CLI.
 */
class CommandRegistry {
  private _commandsByName: Record<string, Command<any, any>>

  constructor() {
    this._commandsByName = this._initialize();
  }

  /**
   * Registers a new {@link Command} class with the CLI.
   *
   * @param {Class} commandClass 
   */
  addCommand(commandClass: Command<any, any>) {
    this._commandsByName[commandClass.getAlias()] = commandClass;
  }

  /**
   * @param {string} name The command's alias.
   * @returns {Class} The {@link Command} class with the provided alias.
   */
  getCommand(name: string) {
    return this._commandsByName[name];
  }

  /**
   * @returns {Array<Class>} All {@link Command} classes registered with Jambo.
   */
  getCommands() {
    return Object.values(this._commandsByName);
  }

  /**
   * @returns {string[]} The alias of each registered {@link Command}.
   */
  getAliases() {
    return Object.keys(this._commandsByName);
  }

  /**
   * Initializes the registry with classes of built-in Jambo commands: init, import, page,
   * override, build, upgrade, describe, and extract-tranlations.
   *
   * @returns {Map<string, Command>} The built-in commmands' classes, keyed by name.
   */
  _initialize(): Record<string, any> {
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
export default CommandRegistry;