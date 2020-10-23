/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
module.exports = class DescribeCommand {
  constructor(getCommands) {
    /**
     * @type {Function}
     */
    this.getCommands = getCommands;
  }

  getAlias() {
    return 'describe';
  }

  getShortDescription() {
    return 'describe all the registered jambo commands and their possible arguments';
  }

  args() {
    return {};
  }

  /**
   * The describe command filters its own describe out of the jambo describe output.
   */
  describe() {
    return {};
  }

  execute() {
    const commandModuleDescriptions = this._getCommandDescriptions();
    const descriptions = {...commandModuleDescriptions};
    console.dir(descriptions, {
      depth: null,
      maxArrayLength: null
    });
  }

  /**
   * Returns the descriptions of all registered Commands
   */
  _getCommandDescriptions() {
    const descriptions = {};
    for (const command of this.getCommands()) {
      if (command.getAlias() !== 'describe') {
        descriptions[command.getAlias()] = command.describe();
      }
    }
    return descriptions;
  }
}
