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
export default async function registerCustomHbsHelpers(
  hbs: typeof Handlebars,
  pathToCustomHelpers: string): Promise<void>
{
  const registerHelperPromises = fs.readdirSync(pathToCustomHelpers)
    .map(async filename => {
      const filePath = path.resolve(pathToCustomHelpers, filename);
      if (!fs.lstatSync(filePath).isFile()) {
        return;
      }
      const helperName = stripExtension(filename);
      try {
        const helperFunction = (await import(filePath)).default;
        hbs.registerHelper(helperName, helperFunction);
      } catch (err) {
        throw new UserError(
          `Could not register handlebars helper from file ${path}`, err.stack);
      }
    });
  await Promise.all(registerHelperPromises);
}