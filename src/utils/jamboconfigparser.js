const fs = require('file-system');
const mergeOptions = require('merge-options');

exports.computeJamboConfig = function() {
  let config = mergeOptions(
    {
      dirs: {
        themes: 'themes',
        config: 'config',
        overrides: 'overrides',
        output: 'public',
        pages: 'pages',
        layouts: 'layouts'
      }
    },
    JSON.parse(fs.readFileSync('config.json'))
  );

  return config;
}