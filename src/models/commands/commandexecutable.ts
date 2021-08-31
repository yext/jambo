/**
 * The primitive types used by execute arguments
 */
type Primitive = string | number | boolean;

/**
 * Represents a record of argument names to their corresponding type
 */
 export type ExecArgumentRecord = {
  [arg: string]: Primitive | Primitive[]
}

/**
 * Command interface that contains non static fields and methods
 * of a Command instance. It requires a type T that defines the
 * arguments pass to execute()
 */
 export interface CommandExecutable<T extends ExecArgumentRecord> {
  /**
   * Executes the command with the provided arguments.
   * 
   * @param {T} args The arguments passed to the execute command
   */
  execute(args: T): any
}