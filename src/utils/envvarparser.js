const { parse } = require('comment-json');

/**
 * This class stores a mapping of environment variable to serialized value.
 * It exposes a method to retrieve unserialized values from this mapping.
 */
class EnvironmentVariableParser {
    constructor(envVars) {
        this._envVars = envVars;
    }

    /**
     * Computes the unserialized values of the environment variables. This method
     * takes in a parameter indicating which environment variables were serialized
     * as JSON. All other variables are assumed to correspond to simple strings.
     * 
     * @param {Array<string>} jsonEnvVars The environment variables serialized as JSON. 
     * @returns {Object} An object containing the unserialized values, keyed by
     *                   environment variable.
     */
    parse(jsonEnvVars) {
        const parsedValuesAccumulator = (accumulator, envVar) => {
            if (jsonEnvVars.includes(envVar)) {
                accumulator[envVar] = parse(this._envVars[envVar], null, true);
            } else {
                accumulator[envVar] = this._envVars[envVar];
            }
            return accumulator;
        }

        return Object.keys(this._envVars).reduce(parsedValuesAccumulator, {});
    }

    /**
     * Creates an instance of an {@link EnvironmentVariableParser} from the
     * process.env object.
     * 
     * @returns {EnvironmentVariableParser} The new parser.
     */
    static create() {
        return new EnvironmentVariableParser(process.env);
    }
}
exports.EnvironmentVariableParser = EnvironmentVariableParser;