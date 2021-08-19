/* eslint-disable @typescript-eslint/no-empty-function */
import { JamboConfig } from '../JamboConfig';
import { ArgumentMetadata } from './argumentmetadata';

/**
 * An interface that represents a command in the Jambo CLI. 
 */
class Command {

  /**
   * @returns {string} The alias for the command.
   */
  static getAlias(): string { return ''; }

  /**
   * @returns {string} A short, one sentence description of the command. This
   *                   description appears as part of the help text in the CLI. 
   */
  static getShortDescription(): string {
    return '';
  }

  /**
   * Executes the command with the provided arguments.
   * 
   * @param {Object<string, unknown>} args The arguments, keyed by name.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(args: Record<string, unknown>): Record<string, unknown> {
    return {};
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} Descriptions of each argument,
   *                                             keyed by name.
   */
  static args(): Record<string, ArgumentMetadata>{
    return {};
  }

  /**
   * @param {Object} jamboConfig the config of the jambo repository
   * @returns {Object} description of the card command, including paths to 
   *                   all available cards
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static describe(jamboConfig: JamboConfig): Promise<any> | any {}
}
export default Command;