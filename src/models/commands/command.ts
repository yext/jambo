import { DescribeOutput } from './describeoutput';
import { JamboConfig } from '../JamboConfig';
import { ArgumentMetadata } from './argumentmetadata';

type toPrim<T = never> = {
  'string': string
  'number': number
  'boolean': boolean
  'array': T[]
}

type Metadata = {
  type: keyof toPrim,
  itemType?: keyof toPrim
}

/**
 * generate a type based on the arguments given to Jambo command
 */
export type ArgsForExecute<T extends Record<string, Metadata>> = {
  [prop in keyof T]: toPrim<toPrim[T[prop]['itemType']]>[T[prop]['type']]
}

/**
 * Command interface that contains non static fields and methods
 * of a Command instance. It requires a type T that defines the
 * arguments pass to execute()
 */
interface CommandExecutable<T> {
  /**
   * Executes the command with the provided arguments.
   * 
   * @param {Object<string, any>} args The arguments, keyed by name.
   */
  execute(args?: ArgsForExecute<T & Record<string, Metadata>>): any
}

/**
 * An interface that represents a command in the Jambo CLI. 
 * Contains non static (CommandExecutable interface) and 
 * static (specified in here) fields and methods.
 */
export default interface Command<T> {
  new(...args: any[]):CommandExecutable<T>;

  /**
   * The alias for the command.
   */
  getAlias(): string;
  
  /**
   * A short, one sentence description of the command. This
   * description appears as part of the help text in the CLI. 
   */
   getShortDescription() : string;

  /**
   * Descriptions of each argument, keyed by name.
   */
   args(): Record<string, ArgumentMetadata>;

  /**
   * @param {Object} jamboConfig the config of the jambo repository
   * @returns {Object} description of the card command, including paths to 
   *                   all available cards
   */
  describe(jamboConfig: JamboConfig): DescribeOutput;
}
