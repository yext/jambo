/**
 * An enum describing the different kinds of argument that are supported.
 */
const ArgumentType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array'
}
Object.freeze(ArgumentType);

/**
 * A class outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
class ArgumentMetadata {
  constructor({ type, itemType, description, isRequired, defaultValue, displayName }) {
    this._displayName = displayName;
    this._type = type;
    this._itemType = itemType;
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
   * @returns {ItemType} The type of the elements of an array argument.
   */
  getItemType() {
    return this._itemType;
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

  /**
   * @returns {string} The display name for the argument.
   */
  getDisplayName() {
    return this._displayName;
  }

  /**
   * Returns an Object with the keys expected by the Jambo describe command
   *
   * @returns {Object}
   */
  toDescribeFormat() {
    return {
      displayName: this.getDisplayName(),
      type: this.getType(),
      required: this.isRequired(),
      default: this.defaultValue(),
    };
  }
}
module.exports = { ArgumentMetadata, ArgumentType };