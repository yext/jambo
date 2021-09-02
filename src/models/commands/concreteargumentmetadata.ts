import { ArgumentType, ArgumentMetadata } from './ArgumentMetadata'

/**
 * The base concrete ArgumentMetadata class.
 */
export class ArgumentMetadataImpl<T extends ArgumentType> implements ArgumentMetadata<T> {
  description: string
  isRequired?: boolean
  defaultValue?: T
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
export class StringMetadata extends ArgumentMetadataImpl<string> implements InternalMetadata {
  readonly type = 'string'
}
export class StringArrayMetadata extends ArgumentMetadataImpl<string[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'string'
}

export class BooleanMetadata extends ArgumentMetadataImpl<boolean> implements InternalMetadata {
  readonly type = 'boolean'
}
export class BooleanArrayMetadata extends ArgumentMetadataImpl<boolean[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'boolean'
}

export class NumberMetadata extends ArgumentMetadataImpl<number> implements InternalMetadata {
  readonly type = 'number'
}
export class NumberArrayMetadata extends ArgumentMetadataImpl<number[]> implements InternalArrayMetadata {
  readonly type = 'array'
  readonly itemType = 'number'
}


/**
 * The specific ArgumentMetadata implementations we allow.
 */
export type ConcreteArgumentMetadata =
  StringMetadata |
  StringArrayMetadata |
  BooleanMetadata |
  BooleanArrayMetadata |
  NumberMetadata |
  NumberArrayMetadata;

/**
 * A type composed of the classes themselves, rather than instances of them
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
 */
export type ArgumentMetadataRecord = Record<string, ConcreteArgumentMetadata>;
