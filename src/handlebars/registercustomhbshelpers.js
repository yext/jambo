import fs from 'fs';
import path from 'path';
import UserError from '../errors/usererror';
import { stripExtension } from '../utils/fileutils';

/**
 * Register's handlebars helpers from the root level of a folder.
 *
 * @param {Handlebars} hbs the handlebars instance
 * @param {string} pathToCustomHelpers the path to the hbs helpers directory
 */
export default function registerCustomHbsHelpers(hbs, pathToCustomHelpers) {
  fs.readdirSync(pathToCustomHelpers)
    .forEach(filename => {
      const filePath = path.resolve(pathToCustomHelpers, filename);
      if (!fs.lstatSync(filePath).isFile()) {
        return;
      }
      const helperName = stripExtension(filename);
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        hbs.registerHelper(helperName, require(filePath));
      } catch (err) {
        throw new UserError(
          `Could not register handlebars helper from file ${path}`, err.stack);
      }
    });
}