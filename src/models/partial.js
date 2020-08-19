const { stripExtension } = require("../utils/fileutils");

/**
 * A data model representing a partial that registered with Jambo.
 */
module.exports = class Partial {
  /**
   * @param {String} path
   * @param {String} fileContents
   */
  constructor(path, fileContents) {
    /**
     * @type {String}
     */
    this.path = path;

    /**
     * @type {String}
     */
    this.fileContents = fileContents;
  }

  /**
   * Returns the partial name
   *
   * @returns {String}
   */
  getName() {
    return stripExtension(this.path);
  }

  /**
   * Returns the partial's path
   *
   * @returns {String}
   */
  getPath() {
    return this.path;
  }

  /**
   * Returns the partial's contents
   *
   * @returns {String}
   */
  getFileContents() {
    return this.fileContents;
  }
}