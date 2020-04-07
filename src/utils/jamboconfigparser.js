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
        partials: 'partials',
        cards: 'cards'
      }
    },
    JSON.parse(fs.readFileSync('jambo.json'))
  );

  return config;
}