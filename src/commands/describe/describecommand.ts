import { ArgumentMetadata } from '../../models/commands/argumentmetadata';
import Command from '../../models/commands/command';
import { JamboConfig } from '../../models/JamboConfig';

/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
const DescribeCommand : Command  = class {
  _jamboConfig: JamboConfig
  getCommands: () => Command[]
  static alias = 'describe';
  static shortDescription = 'describe all the registered jambo commands and their possible arguments';
  static args: Record<string, ArgumentMetadata> = {};

  constructor(jamboConfig, getCommands) {
    /**
     * @type {Function}
     */
    this._jamboConfig = jamboConfig;
    this.getCommands = getCommands;
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
            (value) => { descriptions[command.alias] = value; }
          );
        } else {
          if (command.alias !== 'describe') {
            descriptions[command.alias] = describeValue;
          }
        }
      }
    );
    return Promise.all(describePromises).then(() => descriptions);
  }
}

export default DescribeCommand;
