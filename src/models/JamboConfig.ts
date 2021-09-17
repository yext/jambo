/**
 * Config that optionally contains paths to the various directories needed by Jambo.
 *
 * @public
 */
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