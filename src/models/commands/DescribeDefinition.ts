import {
  ArgumentMetadataRecord,
  StringArrayMetadata,
  BooleanArrayMetadata,
  NumberArrayMetadata,
  ConcreteArgumentMetadata,
  StringMetadata,
  BooleanMetadata,
  NumberMetadata
} from './concreteargumentmetadata';

/**
 * DescribeOutput provides static type checking for a {@link Command}'s describe(),
 * and ensures that the return value matches the same shape as the {@link Command}'s args.
 */
export default interface DescribeDefinition<T extends ArgumentMetadataRecord> {
  displayName: string
  params?: {
    [arg in keyof T]: DescribeDefinitionParam<T[arg]>
  }
}

export type DescribeDefinitionParam<T extends ConcreteArgumentMetadata> =
  T extends StringArrayMetadata ? DescribeParamForArray<'string'> :
  T extends BooleanArrayMetadata ? DescribeParamForArray<'boolean'> :
  T extends NumberArrayMetadata ? DescribeParamForArray<'number'> :
  T extends StringMetadata ? DescribeParamForPrimitive<'string'> :
  T extends BooleanMetadata ? DescribeParamForPrimitive<'boolean'> :
  T extends NumberMetadata ? DescribeParamForPrimitive<'number'> :
  never;

type DeprecatedDescribeParamTypes = 'string' | 'number' | 'boolean'

type DescribeParamForPrimitive<T extends 'string' | 'number' | 'boolean'> = {
  displayName: string
  options?: StringToPrimitiveType<T>[]
  /**
   * @note 'string', 'number', and 'boolean' are deprecated
   * These types can be automatically inferred from Command.args()
   **/
  type?: 'singleoption' | 'filesystem' | DeprecatedDescribeParamTypes
  /** @deprecated - specify in Command.args() instead */
  required?: boolean,
  /** @deprecated - specify in Command.args() instead */
  default?: StringToPrimitiveType<T>
}

interface DescribeParamForArray<T extends 'string' | 'number' | 'boolean'> {
  displayName: string
  options?: StringToPrimitiveType<T>[]
  type?: 'multioption'
  /** @deprecated - specify in Command.args() instead */
  required?: boolean,
  /** @deprecated - specify in Command.args() instead */
  default?: StringToPrimitiveType<T>[]
}

type StringToPrimitiveType<T extends 'string' | 'number' | 'boolean'> = {
  string: string,
  number: number,
  boolean: boolean
}[T]
