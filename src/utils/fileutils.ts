import fs from 'fs';
import path from 'path';
import process from 'process';

/**
 * Returns the given filename without its extension
 *
 * @returns {string} filename
 */
export function stripExtension(filename) {
  if (filename.indexOf('.') === -1) {
    return filename;
  }
  return filename.substring(0, filename.lastIndexOf('.'));
}

/**
 * Extracts the pageName from a given file name
 *
 * @param {string} filename the file name of the page handlebars template
 * @returns {string}
 */
export function getPageName(filename: string) {
  return filename.split('.')[0];
}

/**
 * Determines whether a filename is valid
 *
 * @param {string} filename the file name
 * @returns {boolean}
 */
export function isValidFile(fileName) {
  return fileName && !fileName.startsWith('.');
}

/**
 * Determines whether a path is valid for registering it as a partial
 *
 * @param {string} path the path to the file
 * @returns {boolean}
 */
export function isValidPartialPath(path: string) {
  if (!path) {
    return false;
  }
  const invalidPaths = ['node_modules', '.git'];
  return invalidPaths.every(invalidPath => {
    return !path.startsWith(`${invalidPath}/`) && !path.includes(`/${invalidPath}/`);
  });
}

/**
 * Search for file with the given name, ignoring extensions.
 * For example, given a desiredFile 'upgrade', will look for
 * files like upgrade.js and upgrade.sh, and return the filename
 * of the first found.
 * 
 * @param {string} desiredFile
 * @param {string} directoryPath
 * @returns {string|undefined} the fileName, if it exists, otherwise undefined.
 */
export function searchDirectoryIgnoringExtensions(desiredFile: string, directoryPath: string) {
  const dirEntries = fs.readdirSync(directoryPath);
  for (const dirEntry of dirEntries) {
    if (desiredFile === stripExtension(dirEntry)) {
      const filePath = path.resolve(process.cwd(), directoryPath, dirEntry);
      if (fs.lstatSync(filePath).isFile()) {
        return dirEntry;
      }
    }
  }
  return undefined;
}
