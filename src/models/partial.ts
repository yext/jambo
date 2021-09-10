import { stripExtension } from '../utils/fileutils';

/**
 * A data model representing a partial that registered with Jambo.
 */
export default class Partial {
  name: string
  fileContents: string

  /**
   * @param {String} path
   * @param {String} fileContents
   */
  constructor(path: string, fileContents: string) {
    /**
     * @type {String}
     */
    this.name = stripExtension(path);

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
    return this.name;
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