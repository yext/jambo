import { ArgumentType } from './argumentmetadata';

/**
 * interface that defines the fields used to describe Jambo commands
 * and their possible arguments.
 */
export interface DescribeOutput {
  displayName?: string
  params?: {
    [argumentName: string]: DescribeArg
  }
}

export interface DescribeArg {
  displayName: string,
  type: DescribeType,
  required?: boolean,
  options?: string[]
}

export type DescribeType = ArgumentType | & 'singleoption' | 'multioption' | 'filesystem'
