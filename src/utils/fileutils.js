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
