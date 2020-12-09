const fs = require('fs');
const path = require('path');

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
 * @returns {string}
 */
isValidFile = function(fileName) {
  return fileName && !fileName.startsWith('.');
}
exports.isValidFile = isValidFile;

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
    if (desiredFile !== stripExtension(dirEntry)) {
      continue;
    }
    const filePath = path.resolve(directoryPath, dirEntry);
    if (fs.lstatSync(filePath).isFile()) {
      return dirEntry;
    }
  }
  return undefined;
}
exports.searchDirectoryIgnoringExtensions = searchDirectoryIgnoringExtensions;