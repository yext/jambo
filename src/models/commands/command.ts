interface JamboConfig {
  dirs: {
    themes: string,
    config: string,
    output: string,
    pages: string,
    translations?: string,
    partials?: string[],
    preservedFiles?: string[]
  },
  defaultTheme?: string
 }
 

interface DescribeOutput {
  displayName: string
  params: {
    [argumentName: string]: {
      displayName: string,
      type: 'string' | 'boolean' | 'singleoption' | 'filesystem',
      required?: boolean,
      options?: string[]
    }
  }
}

interface Command {
  alias: string
  shortDescription : string
  args: {
    [argumentName: string]: ArgumentMetadata
  }
  execute(args: Record<string, any>) : void
  describe(jamboConfig: JamboConfig) : DescribeOutput
}

