import { ArgumentType, ArgumentMetadata } from './ArgumentMetadata'

/**
 * The base concrete ArgumentMetadata class.
 *
 * @public
 */
export class ArgumentMetadataImpl<T extends ArgumentType> implements ArgumentMetadata<T> {
  /**
   * The description of the argument.
   */
  description: string
  /**
   * Optional, a boolean indicating if the argument is required.
   */
  isRequired?: boolean
  /**
   * Optional, a default value for the argument.
   */
  defaultValue?: T
  /**
   * Optional, a display name for the argument.
   */
  displayName?: string

  constructor(metadata: ArgumentMetadata<T>) {
    Object.assign(this, metadata);
  }
}

/**
 * ConcreteMetadata and ConcreteArrayMetadata define additional, internally used metadata
 * for one of a jambo command's arguments.
 */
interface InternalMetadata {
  readonly type: 'string' | 'number' | 'boolean'
}

interface InternalArrayMetadata {
  readonly type: 'array'
  readonly itemType: 'string' | 'number' | 'boolean'
}

/**
 * The concrete metadata implementations are used to provide the type of argument at runtime,
 * by checking the `instanceof` for an ArgumentMetadata.
 * This allows us to hide the "type" and "itemType" implementation details.
 */

/**
 * Metadata for a string argument.
 *
 * @public
 */
export class StringMetadata extends ArgumentMetadataImpl<string> implements InternalMetadata {
  readonly type = 'string'
}
/**
 * Metadata for an array of strings argument.
 *
 * @public
 */
export class StringArrayMetadata extends ArgumentMetadataImpl<string[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'string'
}

/**
 * Metadata for a boolean argument.
 *
 * @public
 */
export class BooleanMetadata extends ArgumentMetadataImpl<boolean> implements InternalMetadata {
  readonly type = 'boolean'
}
/**
 * Metadata for an array of booleans argument.
 *
 * @public
 */
export class BooleanArrayMetadata extends ArgumentMetadataImpl<boolean[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'boolean'
}

/**
 * Metadata for a number argument.
 *
 * @public
 */
export class NumberMetadata extends ArgumentMetadataImpl<number> implements InternalMetadata {
  readonly type = 'number'
}
/**
 * Metadata for an array of numbers argument.
 *
 * @public
 */
export class NumberArrayMetadata extends ArgumentMetadataImpl<number[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'number'
}


/**
 * The specific ArgumentMetadata implementations we allow.
 *
 * @public
 */
export type ConcreteArgumentMetadata =
  StringMetadata |
  StringArrayMetadata |
  BooleanMetadata |
  BooleanArrayMetadata |
  NumberMetadata |
  NumberArrayMetadata;

/**
 * A type composed of the classes themselves, rather than instances of them.
 */
export type ConcreteMetadataClass =
  typeof StringMetadata |
  typeof NumberMetadata |
  typeof BooleanMetadata |
  typeof StringArrayMetadata |
  typeof NumberArrayMetadata |
  typeof BooleanArrayMetadata;

/**
 * The shape of a Command.args() return type
 *
 * @public
 */
export type ArgumentMetadataRecord = Record<string, ConcreteArgumentMetadata>;
