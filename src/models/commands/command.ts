import { JamboConfig } from '../JamboConfig';
import { ArgumentMetadata, ArgumentMetadataRecord } from './argumentmetadata';
import { CommandExecutable, ExecArgumentRecord } from './commandexecutable';

type valToType<T = never> = {
  'string': string
  'number': number
  'boolean': boolean
  'array': T[]
}

/**
 * generate a type based on the arguments given to Jambo command
 */
export type ArgsForExecute<T extends Record<string, ArgumentMetadata>> = {
  [prop in keyof T]: valToType<valToType[T[prop]['itemType']]>[T[prop]['type']]
}

/**
 * An interface that represents a command in the Jambo CLI. 
 * Contains non static (CommandExecutable interface) and 
 * static (specified in here) fields and methods.
 */
export default interface Command<T extends ArgumentMetadataRecord, S extends ExecArgumentRecord> {
  new(...args: any[]):CommandExecutable<S>;

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
   *                   all available cards
   */
  describe(jamboConfig: JamboConfig): any;
}
