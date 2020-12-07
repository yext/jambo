const fs = require('fs');
const path = require('path');
const UserError = require('../errors/usererror');
const { stripExtension } = require('../utils/fileutils');

/**
 * Register's handlebars helpers from the root level of a folder.
 *
 * @param {Handlebars} hbs the handlebars instance
 * @param {string} pathToCustomHelpers the path to the hbs helpers directory
 */
module.exports = function registerCustomHbsHelpers(hbs, pathToCustomHelpers) {
  fs.readdirSync(pathToCustomHelpers)
    .forEach(filename => {
      const filePath = path.resolve(pathToCustomHelpers, filename);
      if (!fs.lstatSync(filePath).isFile()) {
        return;
      }
      const helperName = stripExtension(filename);
      try {
        hbs.registerHelper(helperName, require(filePath));
      } catch (err) {
        throw new UserError(
          `Could not register handlebars helper from file ${path}`, err.stack);
      }
    });
}