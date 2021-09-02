exports.LegacyArgumentType = Object.freeze({
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array'
});

exports.LegacyArgumentMetadata = class {
  constructor(type, description, isRequired, defaultValue, itemType) {
    this._type = type;
    this._isRequired = isRequired;
    this._defaultValue = defaultValue;
    this._description = description;
    this._itemType = itemType;
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
}