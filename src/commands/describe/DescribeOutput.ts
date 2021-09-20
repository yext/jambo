/**
 * DescribeOutput represents the output for a {@link Command}'s describe().
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
