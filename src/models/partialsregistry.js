const fs = require('file-system');

const { isValidFile } = require('../utils/fileutils');
const Partial = require('./partial');

/**
 * PartialsRegistry is a registry of the partials provided to Jambo.
 */
module.exports = class PartialsRegistry {
  constructor(partials) {
    /**
     * @type {Array<Partial>}
     */
    this.partials = partials;
  }

  getPartials() {
    return this.partials;
  }

  /**
   * Returns a {@link PartialsRegistry} containing {@link Partial}s for
   * all partial files in the provided paths. For the fullyQualifiedPaths,
   * the path's root is included in the partial naming scheme; the relativePaths
   * are considered relative to the given path rather than root.
   *
   * @param {Array<String>} fullyQualifiedPaths The set of partials to register
   *                                      using full path for the naming scheme.
   * @param {Array<String>} relativePaths The set of partials to register using
   *                                      the relative path for the naming scheme.
   * @returns {PartialsRegistry}
   */
  static build({ fullyQualifiedPaths, relativePaths }) {
    const partials = [];
    // Register partials using relative paths as partial names
    for (const path of relativePaths) {
      partials.push(...PartialsRegistry.buildPartials(path, false));
    }

    // Register partials using fully qualified paths as partial names
    for (const path of fullyQualifiedPaths) {
      partials.push(...PartialsRegistry.buildPartials(path, true));
    }

    return new PartialsRegistry(partials);
  }

  /**
   * Builds all partials in the provided path. If the path is a directory,
   * the useFullyQualifiedName parameter dictates if the path's root will be
   * included in the partial naming scheme.
   *
   * @param {string} partialsPath The set of partials to register.
   * @param {boolean} useFullyQualifiedName Whether or not to include the path's root
   *                                        in the name of the newly registered partials.
   * @returns {Array<Partial>}
   */
  static buildPartials(partialsPath, useFullyQualifiedName) {
    let partials = [];
    const pathExists = fs.existsSync(partialsPath);
    if (pathExists && !fs.lstatSync(partialsPath).isFile()) {
      fs.recurseSync(partialsPath, (path, relative, filename) => {
        if (isValidFile(filename)) {
          const partialPath = useFullyQualifiedName
            ? path
            : relative;
          partials.push(new Partial(
            partialPath,
            fs.readFileSync(path).toString()
          ));
        }
      });
    } else if (pathExists) {
      partials.push(new Partial(
        partialsPath,
        fs.readFileSync(partialsPath).toString()
      ));
    }
    return partials;
  }
}