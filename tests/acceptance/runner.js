const fileSystem = require('file-system');
const { runInPlayground } = require('./setup/playground');
const figures = require('figures');
const path = require('path');
const process = require('process');
require('colors');

runTests(process.argv[2]);

/**
 * Runs acceptance test suites from tne suites/ folder.
 * @param {string} testsStartWith only run tests that have this prefix
 */
async function runTests(testsStartWith) {
  const suitePaths = []
  const suitesDir = path.resolve(__dirname, './suites');
  fileSystem.recurseSync(suitesDir, function(filepath, relative) {
    if (testsStartWith && !filepath.startsWith(testsStartWith)) {
      return;
    }
    suitePaths.push('./suites/' + relative);
  });
  
  for (const suitePath of suitePaths) {
    const suiteModule = require(`./${suitePath}`);
    for (const testName of Object.keys(suiteModule)) {
      const suiteFile = path.relative(
        path.resolve(__dirname, '../../'),
        path.resolve(__dirname, suitePath));
      try {
        await runInPlayground(suiteModule[testName]);
        console.log(suiteFile.yellow);
        console.log(figures.tick, testName.green);
      } catch (err) {
        console.log(suiteFile.gray);
        console.log(figures.cross, testName.red);
        throw err;
      }
    }
  }
}
