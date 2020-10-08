/**
 * An interface that represents a command in the Jambo CLI. 
 */
export default interface Command {
  /**
   * The alias for the command, used to invoke it in the CLI.
   */
  getAlias(): string;

  /**
   * A short, one sentence description of the command. This description appears as part
   * of the help text in the CLI. 
   */
  getShortDescription(): string;

  /**
   * Executes the command with the provided arguments.
   * 
   * @param {Object<string, ?>} args The arguments, keyed by name.
   */
  execute(args: Object): void;

  /**
   * @returns {Object<string, ArgumentMetadata>} Descriptions of each argument,
   *                                             keyed by name.
   */
  args(): Object;
}