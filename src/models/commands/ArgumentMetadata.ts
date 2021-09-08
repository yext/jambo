export type ArgumentType = string | number | boolean | string[] | number[] | boolean[];

/**
 * The public interface outlining the metadata for a {@link Command}'s argument. This includes
 * the type of the argument's values, if it is required, and an optional default.
 */
export interface ArgumentMetadata<T extends ArgumentType> {
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
  defaultValue?: T
}
