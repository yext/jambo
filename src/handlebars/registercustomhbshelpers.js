const fs = require('file-system');
const UserError = require('../errors/usererror');
const { stripExtension, isValidFile } = require('../utils/fileutils');

/**
 * Register's Jambo's built-in hbs helpers
 * @param {Handlebars} hbs the handlebars instance
 * @param {string} pathToCustomHelpers the path to the custom hbs helpers directory
 */
module.exports = function registerCustomHbsHelpers(hbs, pathToCustomHelpers) {
  fs.recurseSync(pathToCustomHelpers, (path, relative, filename) => {
    if (isValidFile(filename)) {
      const helperName = stripExtension(filename);
      try {
        hbs.registerHelper(helperName, require(path));  
      } catch (err) {
        throw new UserError(
          `Could not register handlebars helper from file ${path}`, err.stack);
      }
    }
  });
}