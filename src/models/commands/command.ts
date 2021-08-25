/* eslint-disable @typescript-eslint/no-empty-function */
import { JamboConfig } from '../JamboConfig';
import { ArgumentMetadata } from './argumentmetadata';

/**
 * Command interface that contains non static fields and methods
 * of a Command instance
 */
interface CommandExecutable {
  /**
   * Executes the command with the provided arguments.
   * 
   * @param {Object<string, any>} args The arguments, keyed by name.
   */
  execute(args: Record<string, any>): any
}

/**
 * An interface that represents a command in the Jambo CLI. 
 * Contains non static (CommandExecutable interface) and 
 * static (specified in here) fields and methods.
 */
export default interface Command {
  new(...args: any[]):CommandExecutable;

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  describe(jamboConfig: JamboConfig): Promise<any> | any;
}
