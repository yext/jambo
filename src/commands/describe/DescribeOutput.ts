/**
 * DescribeOutput provides static type checking for a {@link Command}'s describe(),
 * and ensures that the return value matches the same shape as the {@link Command}'s args.
 */
export default interface DescribeOutput{
  displayName: string
  params?: Record<string, DescribeParam>
}

export interface DescribeParam {
  displayName: string
  type: 'string' | 'number' | 'boolean' | 'singleoption' | 'filesystem' | 'multioption'
  required?: boolean
  default?: string | number | boolean | string[] | number[] | boolean[]
  options: string[] | number[] | boolean[]
}
