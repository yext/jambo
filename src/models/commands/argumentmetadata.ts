/**
 * defines the different kinds of argument that are supported.
 */
type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

/**
 * An interface outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
interface ArgumentMetadata {
  /**
   * The type of the argument, e.g. STRING, BOOLEAN, etc.
   */
  getType(): ArgumentType

  /**
   * The type of the elements of an array argument.
   */
  getItemType(): string

  /**
   * The description of the argument.
   */
  getDescription(): string

  /**
   * A boolean indicating if the argument is required.
   */
  isRequired(): boolean

  /**
   * Optional, a default value for the argument.
   */
  defaultValue(): string|boolean|number

  /**
   * The display name for the argument.
   */
  getDisplayName(): string
}

class ArgumentMetadata implements ArgumentMetadata {
  _description: string
  _type: string
  _displayName: string
  _itemType: string
  _isRequired: boolean
  _defaultValue: unknown

  constructor({displayName, type, itemType, isRequired, defaultValue, description}: any) {
    this._displayName = displayName;
    this._type = type;
    this._itemType = itemType;
    this._isRequired = isRequired;
    this._defaultValue = defaultValue;
    this._description = description;
  }

  getType() {
    return this._type;
  }

  getItemType() {
    return this._itemType;
  }

  getDescription() {
    return this._description
  }

  isRequired() {
    return !!this._isRequired;
  }

  defaultValue() {
    return this._defaultValue;
  }

  getDisplayName() {
    return this._displayName;
  }
}

export { ArgumentMetadata, ArgumentType };