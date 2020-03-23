const fs = require('file-system');
const { exec } = require('child_process');

/**
 * ScriptRunner is a simple utility class that attempts to execute a shell
 * script provided to Jambo. Note that this class, by default, makes a base
 * set of variables available for use in the script. These variables represent
 * many of the directories known to Jambo.
 */
exports.ScriptRunner = class {
    constructor(jamboConfig) {
        this.baseVars = {
            'CONFIG_DIR': jamboConfig.dirs.config,
            'THEMES_DIR': jamboConfig.dirs.themes,
            'PAGES_DIR': jamboConfig.dirs.pages,
            'PARTIALS_DIR': jamboConfig.dirs.partials
        };
    }

    /**
     * Executes the provided script. Wraps the result of the execution in a Promise.
     * This method can take in additional variables (and their values) that should
     * be made available to the script.
     * 
     * @param {string} scriptFile The path to the shell script.
     * @param {object} additionalVars Any additional variables needed by the script.
     * @returns {Promise} A Promise wrapping the script execution. If execution
     *                    fails, the Promise is rejected with an error. If successful,
     *                    the Promise resolves with stdout.
     */
    execute(scriptFile, additionalVars) {
        const scriptVars = Object.assign({}, this.baseVars, additionalVars);
        const parsedScript = this._parseScriptFile(scriptFile, scriptVars);

        return new Promise(function(resolve, reject) {
            exec(parsedScript, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    /**
     * Returns a new version of the provided script where the requested variables have
     * been made available.
     * 
     * @param {string} file The path to the script file.
     * @param {object} scriptVars An object containing variable names and their values.
     * @returns {string} The parsed shell script with a preamble block containing the
     *                   new variable definitions.
     */
    _parseScriptFile(file, scriptVars) {
        let script = fs.readFileSync(file, 'utf8');
        for (let [key, value] of Object.entries(scriptVars)) {
            script = `${key}=${value}\n${script}`;
        }
        return script;
    }
}