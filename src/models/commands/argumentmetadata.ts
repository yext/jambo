/**
 * An enum describing the different kinds of argument that are supported.
 */
enum ArgumentType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array'
}

/**
 * An interface outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
interface ArgumentMetadata {
  /**
   * The display name for the argument.
   */
  describeName?: string,
  
  /**
   * The description of the argument.
   */
  description: string,
  
  /**
   * The type of the argument, e.g. string, boolean, etc.
   */
  type: ArgumentType,
  
  /**
   * indicate if the argument is required.
   */
  isRequired?: boolean,
  
  /**
   * a default value for the argument
   */
  defaultValue?: string | number | boolean | (string|number|boolean)[]
  
  /**
   * Used for the describe and eventually CLI auto-completion
   */
  options?: (string|number|boolean)[]
}

export { ArgumentMetadata, ArgumentType };