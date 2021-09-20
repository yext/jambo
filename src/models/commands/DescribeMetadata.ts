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
 * DescribeMetadata provides static type checking for a {@link Command}'s describe(),
 * and ensures that the return value matches the same shape as the {@link Command}'s args.
 *
 * @public
 */
export default interface DescribeMetadata<T extends ArgumentMetadataRecord = ArgumentMetadataRecord> {
  displayName: string
  params?: {
    [arg in keyof T]: DescribeMetadataParam<T[arg]>
  }
}

/**
 * The describe() metadata for a {@link Command}'s parameters.
 *
 * @public
 */
export type DescribeMetadataParam<T extends ConcreteArgumentMetadata> =
  T extends StringArrayMetadata ? DescribeParamForArray<string> :
  T extends BooleanArrayMetadata ? DescribeParamForArray<boolean> :
  T extends NumberArrayMetadata ? DescribeParamForArray<number> :
  T extends StringMetadata ? DescribeParamForPrimitive<string> :
  T extends BooleanMetadata ? DescribeParamForPrimitive<boolean> :
  T extends NumberMetadata ? DescribeParamForPrimitive<number> :
  never;

type DeprecatedDescribeParamTypes = 'string' | 'number' | 'boolean'

type DescribeParamForPrimitive<T extends string | number | boolean> = {
  displayName: string
  options?: T[]
  /**
   * @remarks 'string', 'number', and 'boolean' are deprecated
   * These deprecated types can be automatically inferred from Command.args()
   **/
  type?: 'singleoption' | 'filesystem' | DeprecatedDescribeParamTypes
  /** @deprecated - specify in Command.args() instead */
  required?: boolean,
  /** @deprecated - specify in Command.args() instead */
  default?: T
}

interface DescribeParamForArray<T extends string | number | boolean> {
  displayName: string
  options?: T[]
  type?: 'multioption'
  /** @deprecated - specify in Command.args() instead */
  required?: boolean,
  /** @deprecated - specify in Command.args() instead */
  default?: T[]
}
