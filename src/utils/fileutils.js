/**
 * Returns the given filename without its extension
 *
 * @returns {string} filename
 */
stripExtension = function (filename) {
  if (filename.indexOf(".") === -1) {
    return filename;
  }
  return filename.substring(0, filename.lastIndexOf("."));
}
exports.stripExtension = stripExtension;

/**
 * Extracts the pageName from a given file name
 *
 * @param {string} filename the file name of the page handlebars template
 * @returns {string}
 */
getPageName = function (filename) {
  return filename.split('.')[0];
}
exports.getPageName = getPageName;

/**
 * Determines whether a filename is valid
 *
 * @param {string} filename the file name
 * @returns {string}
 */
isValidFile = function (fileName) {
  return fileName && !fileName.startsWith('.');
}
exports.isValidFile = isValidFile;
