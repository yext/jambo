/**
 * An interface that represents a command in the Jambo CLI. 
 */
class Command {

    /**
     * @returns {string} The alias for the command.
     */
    getAlias() {}

    /**
     * @returns {string} A short, one sentence description of the command. This
     *                   description appears as part of the help text in the CLI. 
     */
    getShortDescription() {}

    /**
     * Executes the command with the provided arguments.
     * 
     * @param {Object<string, ?>} args The arguments, keyed by name.
     */
    execute(args) {}

    /**
     * @returns {Object<string, ArgumentMetadata>} Descriptions of each argument,
     *                                             keyed by name.
     */
    args() {}
}
module.exports = Command;