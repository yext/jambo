/**
 * Command interface that contains non static fields and methods
 * of a Command instance. It requires a type T that defines the
 * arguments pass to execute()
 */
 export interface CommandExecutable<T> {
  /**
   * Executes the command with the provided arguments.
   * 
   * @param {T} args The arguments passed to the execute command
   */
  execute(args: T): any
}