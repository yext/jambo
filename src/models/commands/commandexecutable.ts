import {
  ArgumentMetadataRecord,
  BooleanArrayMetadata,
  BooleanMetadata,
  NumberArrayMetadata,
  NumberMetadata,
  StringArrayMetadata,
  StringMetadata
} from './concreteargumentmetadata';

/**
 * Type of arguments that can be passed to the execute command.
 *
 * @public
 */
export type ExecArgs<T extends ArgumentMetadataRecord> = {
  [arg in keyof T]:
    T[arg] extends StringMetadata ? string :
    T[arg] extends StringArrayMetadata ? string[] :
    T[arg] extends BooleanMetadata ? boolean :
    T[arg] extends BooleanArrayMetadata ? boolean[] :
    T[arg] extends NumberMetadata ? number :
    T[arg] extends NumberArrayMetadata ? number[] :
    never;
}

/**
 * Command interface that contains non static fields and methods
 * of a Command instance. It requires a type T that defines the
 * arguments pass to execute().
 *
 * @public
 */
export interface CommandExecutable<T extends ArgumentMetadataRecord> {
  /**
   * Executes the command with the provided arguments.
   *
   * @param args - The arguments passed to the execute command
   */
  execute(args: ExecArgs<T>): void
}