export interface JamboConfig {
  dirs?: {
    themes: string
    config: string
    output: string
    pages: string
    partials: string[]
    preservedFiles?: string[]
    translations?: string
  }
  defaultTheme?: string
}