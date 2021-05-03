/**
 * An enum describing the different kinds of argument that are supported.
 */
type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

/**
 * A class outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
interface ArgumentMetadata {
  describeDisplayName: string,
  description: string,
  type: ArgumentType,
  isRequired?: boolean,
  defaultValue?: string | number | boolean | (string|number|boolean)[],
  options?: (string|number|boolean)[] // Used for the describe and eventually CLI auto-completion
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

interface DescribeOutput {

}
module.exports = { ArgumentMetadata, ArgumentType };