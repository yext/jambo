import Command from '../../models/commands/command';
import { JamboConfig } from '../../models/JamboConfig';
import { DescribeOutput } from './DescribeOutput';

/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
const DescribeCommand : Command  = class {
  private _jamboConfig: JamboConfig
  getCommands: () => Command[]

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

  execute() {
    const descriptions = this._getCommandDescriptions();
    console.log(JSON.stringify(descriptions, null, 2));
  }

  /**
   * Returns the descriptions of all registered Commands
   */
  _getCommandDescriptions(): Record<string, DescribeOutput> {
    const descriptions = {};
    this.getCommands().map(
      command => {
        if(command.getAlias() !== 'describe') {
          descriptions[command.getAlias()] = command.describe(this._jamboConfig);
        }
      }
    );
    return descriptions;
  }
}

export default DescribeCommand;
