/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
module.exports = class DescribeCommand {
  constructor(jamboConfig, getCommands) {
    /**
     * @type {Function}
     */
    this._jamboConfig = jamboConfig;
    this.getCommands = getCommands;
  }

  static getAlias() {
    return 'describe';
  }

  static getShortDescription() {
    return 'describe all the registered jambo commands and their possible arguments';
  }

  static args() {
    return {};
  }

  /**
   * The describe command filters its own describe out of the jambo describe output.
   */
  static describe() {
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
        const commandClass = command.obj;
        const describeValue = commandClass.describe(this._jamboConfig);
        if (describeValue.then && typeof describeValue.then === 'function') {
          return describeValue.then(
            (value) => { descriptions[commandClass.getAlias()] = value; }
          );
        } else {
          if (commandClass.getAlias() !== 'describe') {
            descriptions[commandClass.getAlias()] = describeValue;
          }
        }
      }
    );
    return Promise.all(describePromises).then(() => descriptions);
  }
}
