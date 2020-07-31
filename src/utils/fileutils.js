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
 * Extracts the pageId from a given file name
 *
 * @param {string} filename the file name of the page handlebars template
 * @returns {string}
 */
getPageId = function (filename) {
  return filename.split('.')[0];
}
exports.getPageId = getPageId;

/**
 * Extracts the locale from a given file name
 *
 * @param {string} filename the file name of the page handlebars template
 * @returns {string}
 */
getLocale = function (filename) {
  const pageParts = stripExtension(stripExtension(filename)).split('.');
  return pageParts.length > 1 && pageParts[1];  // TODO seems brittle
}
exports.getLocale = getLocale;
