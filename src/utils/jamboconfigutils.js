const fs = require('file-system');
const path = require('path');
const mergeOptions = require('merge-options');

/**
 * Parses the repository's Jambo config file. If certain attributes are not
 * present, defaults will be applied.
 * 
 * @returns {Object} The parsed Jambo configuration, as an {@link Object}. 
 */
parseJamboConfig = function() {
  let config = mergeOptions(
    {
      dirs: {
        themes: 'themes',
        config: 'config',
        output: 'public',
        pages: 'pages',
        partials: ['partials'],
      }
    },
    JSON.parse(fs.readFileSync('jambo.json'))
  );
  return config;
}
exports.parseJamboConfig = parseJamboConfig;

/**
 * Registers a new set of Handlebars partials in the Jambo configuration
 * file. The set will not be registered if it has been already or if it
 * comes from a Theme's 'static' directory.
 * 
 * @param {string} partialsPath The local path to the set of partials. 
 */
exports.addToPartials = function(partialsPath) {
  const jamboConfig = parseJamboConfig();
  const existingPartials = jamboConfig.dirs.partials;

  const shouldAddNewPartialsPath = 
    !existingPartials.includes(partialsPath) && 
    partialsPath.split(path.sep)[0] !== 'static';
  
  if (shouldAddNewPartialsPath) {
    existingPartials.push(partialsPath);
    fs.writeFileSync('jambo.json', JSON.stringify(jamboConfig, null, 2));
  }
}