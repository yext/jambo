/**
 * Defines the different kinds of arguments that are supported.
 */
export type LegacyArgumentType = 'string' | 'number' | 'boolean' | 'array';
export type LegacyArgumentItemType = 'string' | 'number' | 'boolean';

/**
 * An interface describing the legacy version of {@link ArgumentMetadata}.
 * @deprecated
 */
export interface LegacyArgumentMetadata {
  /**
   * The type of the argument, e.g. 'string', 'boolean', etc.
   */
  getType(): LegacyArgumentType

  /**
   * The type of the elements of an array argument.
   */
  getItemType(): LegacyArgumentItemType | undefined

  /**
   * The description of the argument.
   */
  getDescription(): string

  /**
   * A boolean indicating if the argument is required.
   */
  isRequired(): boolean | undefined

  /**
   * Optional, a default value for the argument.
   */
  defaultValue(): string | boolean | number | undefined
}

/**
 * Returns true if the provided metadata object is the legacy model
 */
export function isLegacyArgumentMetadata(metadata: any): metadata is LegacyArgumentMetadata {
  return metadata.getType !== undefined;
}