/**
 * A domain model representation of a custom shell command to be run as part
 * of a built-in Jambo command. These shell commands are supplied by Themes.
 */
exports.CustomCommand = class {
    constructor({ file, args, cwd }) {
        this._file = file;
        this._fileType = file.split('.').pop();
        this._args = args || [];
        this._cwd = cwd;
    }

    /**
     * Returns the {@link CustomCommand} as a string. The string matches exactly
     * what someone would type into the shell to run the command.
     * 
     * @returns {string} The stringified {@link CustomCommand}.
     */
    toString() {
        const argReducer = (argsString, currentArgs) => {
            const [name, value] = currentArgs;
            return argsString.concat(` ${name}=${value}`);
        };
        const parsedArgs = this._args.reduce(argReducer, '');

        let commandPrefix;
        switch (this._fileType) {
            case 'js':
                commandPrefix = `node ${this._file}`;
                break;
            case 'sh':
                commandPrefix = `./${this._file}`;
                break;
            default:
                throw 'Unsupported file type';
        }

        return `${commandPrefix} ${parsedArgs}`;
    }

    /**
     * Add additional arguments for the executable.
     * 
     * @param {Array} args The additional arguments.
     */
    addArgs(args) {
        this._args = this._args.concat(args);
    }

    /**
     * Provides the list of arguments to be used when the executable
     * is invoked.
     * 
     * @returns {Array} The current arguments.
     */
    getArgs() {
        return this._args.slice();
    }

    /**
     * Returns the file name of the executable.
     * 
     * @returns {string} The name of the executable.
     */
    getFile() {
        return this._file;
    }

    /**
     * Provides the cwd to be used when executing the {@link CustomCommand}.
     * 
     * @returns {string} The cwd.
     */
    getCwd() {
        return this._cwd;
    }
}