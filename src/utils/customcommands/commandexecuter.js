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
     * Makes command line flags for all of the properties in the given jambo config.
     * 
     * @param {Object} jamboConfig The Jambo config object.
     * @param {Array<string>} flagPath The currently traversed path of the config
     * @returns {Array} An array containing the flags to add to any {@link CustomCommand}.
     */
    _generateJamboFlags(jamboConfig, flagPath = []) {
        const jamboFlags = [];
        const prefix = '--jambo';

        for (const [name, value] of Object.entries(jamboConfig)) {
            if (Array.isArray(value)) {
                jamboFlags.push([prefix, ...flagPath, name].join('.'));
                jamboFlags.push(value);
            } else if (typeof value === 'string') {
                jamboFlags.push([prefix, ...flagPath, name].join('.'));
                jamboFlags.push(value);
            } else if (typeof value === 'object') {
                const subConfigFlags = this._generateJamboFlags(value, [...flagPath, name]);
                jamboFlags.push(...subConfigFlags)
            }
        }
        return jamboFlags;
    }
}
