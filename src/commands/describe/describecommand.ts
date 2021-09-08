import Command from '../../models/commands/Command';
import { ArgumentMetadataRecord } from '../../models/commands/concreteargumentmetadata';
import DescribeDefinition from '../../models/commands/DescribeDefinition';
import { JamboConfig } from '../../models/JamboConfig';
import DescribeOutput from './DescribeOutput';

/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
const DescribeCommand: Command<any> = class {
  private _jamboConfig: JamboConfig
  getCommands: () => Command<ArgumentMetadataRecord>[]

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
    return null;
  }

  async execute() {
    const descriptions = await this.getCommandDescriptions();
    console.log(JSON.stringify(descriptions, null, 2));
  }

  /**
   * Returns the descriptions of all registered Commands
   */
  private getCommandDescriptions() {
    const descriptions = {};
    const commands = this.getCommands();
    const describePromises = commands.map(command => {
      const recordDescription = (value: DescribeDefinition<ArgumentMetadataRecord>) => {
        descriptions[command.getAlias()] = this.calculateDescribeOutput(command.args(), value);
      }
      const describeValue = command.describe(this._jamboConfig);
      if (!describeValue) {
        return;
      }
      if (isPromise(describeValue)) {
        return describeValue.then(value => {
          value && recordDescription(value);
        });
      } else {
        recordDescription(describeValue);
      }
    });
    return Promise.all(describePromises).then(() => descriptions);
  }

  private calculateDescribeOutput(
    args: ArgumentMetadataRecord,
    describeDefinition: DescribeDefinition<ArgumentMetadataRecord>
  ): DescribeOutput {
    if (!describeDefinition.params) {
      return {
        displayName: describeDefinition.displayName
      };
    }
    const mergedParams = {};
    for (const [argName, describeParam] of Object.entries(describeDefinition.params)) {
      const concreteMetadata = args[argName];
      mergedParams[argName] = {
        required: concreteMetadata.isRequired,
        default: concreteMetadata.defaultValue,
        type: concreteMetadata.type,
        ...describeParam
      }
    }
    return {
      displayName: describeDefinition.displayName,
      params: mergedParams
    };
  }
}

function isPromise(
  describeValue: DescribeDefinition<ArgumentMetadataRecord> | Promise<DescribeDefinition<ArgumentMetadataRecord>>
): describeValue is Promise<DescribeDefinition<ArgumentMetadataRecord>> {
  if (!('then' in describeValue)) {
    return false;
  }
  return typeof describeValue.then === 'function';
}

export default DescribeCommand;
