/**
 * An enum describing the different kinds of argument that are supported.
 */
const ArgumentType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean'
}
Object.freeze(ArgumentType);

/**
 * A class outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
class ArgumentMetadata {
  constructor(type, description, isRequired, defaultValue) {
    this._type = type;
    this._isRequired = isRequired;
    this._defaultValue = defaultValue;
    this._description = description;
  }

  /**
   * @returns {ArgumentType} The type of the argument, e.g. STRING, BOOLEAN, etc.
   */
  getType() {
    return this._type;
  }

  /**
   * @returns {string} The description of the argument.
   */
  getDescription() {
    return this._description
  }

  /**
   * @returns {boolean} A boolean indicating if the argument is required.
   */
  isRequired() {
    return !!this._isRequired;
  }

  /**
   * @returns {string|boolean|number} Optional, a default value for the argument. 
   */
  defaultValue() {
    return this._defaultValue;
  }

}
module.exports = { ArgumentMetadata, ArgumentType };