/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
class DescribeCommand {
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
    const descriptions = await this._getCommandDescriptions();
    console.log(JSON.stringify(descriptions, null, 2));
  }

  /**
   * Returns the descriptions of all registered Commands
   */
  _getCommandDescriptions() {
    const descriptions = {};
    const describePromises = this.getCommands().map(
      command => {
        const describeValue = command.describe(this._jamboConfig);
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
    return Promise.all(describePromises).then(() => descriptions);
  }
}

module.exports = DescribeCommand;
