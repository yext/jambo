/**
 * A domain model representation of a custom shell command to be run as part
 * of a built-in Jambo command. These shell commands are supplied by Themes.
 */
exports.CustomCommand = class {
    constructor({ executable, args, cwd }) {
        this._executable = executable;
        this._args = args || [];
        this._cwd = cwd;
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
     * Returns the executable to be invoked.
     * 
     * @returns {string} The executable.
     */
    getExecutable() {
        return this._executable;
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