import { JamboConfig } from '../JamboConfig';
import { ArgumentMetadataRecord } from './concreteargumentmetadata';
import { CommandExecutable } from './commandexecutable';
import DescribeDefinition from './DescribeDefinition';

/**
 * An interface that represents a command in the Jambo CLI.
 * Contains non static (CommandExecutable interface) and
 * static (specified in here) fields and methods.
 */
export default interface Command<T extends ArgumentMetadataRecord> {
  new(...args: any[]): CommandExecutable<T>;

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
   args(): T;

  /**
   * @param {Object} jamboConfig the config of the jambo repository
   * @returns {Object} description of the card command, including paths to
   *                   all available cards. returning null causes no description to be output.
   */
  describe(jamboConfig: JamboConfig): null | DescribeDefinition<T>;
}