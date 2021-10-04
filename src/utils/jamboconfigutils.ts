import fs from 'fs';
import path from 'path';
import mergeOptions from 'merge-options';
import { parse, stringify } from 'comment-json';
import UserError from '../errors/usererror';
import { JamboConfig } from '../models/JamboConfig';

/**
 * Parses the repository's Jambo config file. If certain attributes are not
 * present, defaults will be applied for them.
 *
 * @returns {Object} The parsed Jambo configuration, as an {@link Object}.
 */
export function parseJamboConfig(): JamboConfig {
  try {
    const config: JamboConfig = mergeOptions(
      {
        dirs: {
          themes: 'themes',
          config: 'config',
          output: 'public',
          pages: 'pages',
          partials: ['partials'],
        }
      },
      parse(fs.readFileSync('jambo.json', 'utf8'))
    );
    return config;
  } catch (err) {
    throw new UserError('Error parsing jambo.json', err.stack);
  }
}
// Unfortunately, we need this for backwards compatibility purposes. We used to
// declare many of our helpers on the global namespace, and the global parseJamboConfig
// was actually being referenced in answers-hitchhiker-theme
// (see PRs #19 in @yext/jambo and #364 in @yext/answers-hitchhiker-theme)
globalThis.parseJamboConfig = parseJamboConfig;

/**
 * Registers a new set of Handlebars partials in the Jambo configuration
 * file. The set will not be registered if it has been already or if it
 * comes from a Theme's 'static' directory.
 *
 * @param {string} partialsPath The local path to the set of partials.
 */
export const addToPartials = function(partialsPath: string) {
  const jamboConfig = parseJamboConfig();
  const existingPartials = jamboConfig.dirs.partials;

  const shouldAddNewPartialsPath =
    !existingPartials.includes(partialsPath) &&
    partialsPath.split(path.sep)[0] !== 'static';

  if (shouldAddNewPartialsPath) {
    existingPartials.push(partialsPath);
    fs.writeFileSync('jambo.json', stringify(jamboConfig, null, 2));
  }
};