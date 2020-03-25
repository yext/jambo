const path = require('path');
const { exec } = require('child_process');

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
     * is wrapped in a Promise.
     * 
     * @param {CustomCommand} command The command to execute in the shell.
     * @returns {Promise} A Promise wrapping the command execution. If execution
     *                    fails, the Promise is rejected with an error. If 
     *                    successful, the Promise resolves with stdout.
     */
    execute(command) {
        command.addArgs(Object.entries(this._jamboFlags));
        return new Promise(function(resolve, reject) {
            exec(
                command.toString(),
                { cwd: command.getCwd() },
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else if (stderr) {
                        reject(stderr);
                    } else {
                        resolve(stdout);
                    }
                }
            );
        });
    }

    /**
     * Makes command line flags for the various Jambo directories. Ensures that the
     * absolute path for all directories is used.
     * 
     * @param {Object} jamboConfig The Jambo config object.
     * @returns {Object} An object containing the flags to add to any
     *                   {@link CustomCommand}.
     */
    _generateJamboFlags(jamboConfig) {
        const getAbsolutePath = jamboDir => {
            return path.isAbsolute(jamboDir) ? 
                jamboDir : 
                path.join(process.cwd(), jamboDir);
        }
        return {
            '--jambo.config_dir': getAbsolutePath(jamboConfig.dirs.config),
            '--jambo.themes_dir': getAbsolutePath(jamboConfig.dirs.themes),
            '--jambo.pages_dir': getAbsolutePath(jamboConfig.dirs.pages),
            '--jambo.partials_dir': getAbsolutePath(jamboConfig.dirs.partials)
        }
    }
}