const path = require('path');
const { spawnSync } = require('child_process');

/**
 * This class is responsible for executing a {@link CustomCommand}.
 * It makes the various Jambo directories available to the command as
 * flags.
 */
exports.CustomCommandExecuter = class {
    constructor(jamboConfig) {
        this._jamboFlags = this._generateJamboFlags(jamboConfig);
    }

    /**
     * Executes the provided {@link CustomCommand}. The result of the execution
     * is returned.
     * 
     * @param {CustomCommand} command The command to execute in the shell.
     * @returns {Object} The result of executing the {@link CustomCommand}. This
     *                   object contains stdout, stderr, a status code, and an
     *                   error if the child process failed.
     */
    execute(command) {
        command.addArgs(this._jamboFlags);
        return spawnSync(
            command.getExecutable(),
            command.getArgs(),
            { cwd: command.getCwd(), shell: true },
        );
    }

    /**
     * Makes command line flags for the various Jambo directories. Ensures that the
     * absolute path for all directories is used.
     * 
     * @param {Object} jamboConfig The Jambo config object.
     * @returns {Array} An array containing the flags to add to any {@link CustomCommand}.
     */
    _generateJamboFlags(jamboConfig) {
        const jamboFlags = [];

        const getAbsolutePath = jamboDir => {
            return path.isAbsolute(jamboDir) ? 
                jamboDir : 
                path.join(process.cwd(), jamboDir);
        }
        Object.entries(jamboConfig.dirs).forEach(([name, value]) => {
            jamboFlags.push(`--jambo.${name}_dir`);
            jamboFlags.push(getAbsolutePath(value));
        });

        return jamboFlags;
    }
}