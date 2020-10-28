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

  async execute() {
    console.dir(await this._getCommandDescriptions(), {
      depth: null,
      maxArrayLength: null
    });
  }

  /**
   * Returns the descriptions of all registered Commands
   */
  _getCommandDescriptions() {
    const descriptions = {};
    const describePromises = this.getCommands().map(
      command => {
        const describeValue = command.describe();
        if (describeValue.then && typeof describeValue.then === 'function') {
          return describeValue.then(
            (value) => { descriptions[command.getAlias()] = value; }
          );
        } else {
          if (command.getAlias() !== 'describe') {
            descriptions[command.getAlias()] = describeValue;
          }
        }
      }
    );
    return Promise.all(describePromises).then(
      () => descriptions
    );
  }
}
