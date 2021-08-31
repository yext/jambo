/**
 * Defines the different kinds of arguments that are supported.
 */
export type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

/**
 * An interface outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
export interface ArgumentMetadata {
  /**
   * The type of the argument, e.g. 'string', 'boolean', etc.
   */
  type: ArgumentType

  /**
   * The type of the elements of an array argument.
   */
  itemType?: ArgumentType

  /**
   * The description of the argument.
   */
  description: string

  /**
   * A boolean indicating if the argument is required.
   */
  isRequired?: boolean

  /**
   * Optional, a default value for the argument.
   */
  defaultValue?: string|boolean|number

  /**
   * The display name for the argument.
   */
  displayName?: string
}