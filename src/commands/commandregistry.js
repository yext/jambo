/**
 * A registry that maintains the built-in and custom commands for the Jambo CLI.
 */
class CommandRegistry {
  constructor() {
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
    // TODO: Add built-in commands as they are cut over to the new pattern.
    return {};
  }
}
module.exports = CommandRegistry;