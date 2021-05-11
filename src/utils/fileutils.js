const fs = require('fs');
const path = require('path');
const process = require('process');

/**
 * Returns the given filename without its extension
 *
 * @returns {string} filename
 */
stripExtension = function(filename) {
  if (filename.indexOf('.') === -1) {
    return filename;
  }
  return filename.substring(0, filename.lastIndexOf('.'));
}
exports.stripExtension = stripExtension;

/**
 * Extracts the pageName from a given file name
 *
 * @param {string} filename the file name of the page handlebars template
 * @returns {string}
 */
getPageName = function(filename) {
  return filename.split('.')[0];
}
exports.getPageName = getPageName;

/**
 * Determines whether a filename is valid
 *
 * @param {string} filename the file name
 * @returns {boolean}
 */
isValidFile = function(fileName) {
  return fileName && !fileName.startsWith('.');
}
exports.isValidFile = isValidFile;

/**
 * Determines whether a path is valid for registering it as a partial
 *
 * @param {string} path the path to the file
 * @returns {boolean}
 */
isValidPartialPath = function(path) {
  if (!path) {
    return false;
  }
  const invalidPaths = ['node_modules', '.git'];
  return invalidPaths.every(invalidPath => {
    return !path.startsWith(`${invalidPath}/`) && !path.includes(`/${invalidPath}/`);
  });
}
exports.isValidPartialPath = isValidPartialPath;

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
searchDirectoryIgnoringExtensions = function(desiredFile, directoryPath) {
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
exports.searchDirectoryIgnoringExtensions = searchDirectoryIgnoringExtensions;