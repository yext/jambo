const path = require('path');
const fsExtra = require('fs-extra');
const { chdir, cwd } = require('process');
const TestInstance = require('./TestInstance');

/**
 * Runs a test suite in a playground-[id] folder.
 *
 * @param {Function} testFunction 
 */
exports.runInPlayground = async function(testFunction, procrastinateCleanup = false) {
  const originalDir = cwd();
  const id = parseInt(Math.random() * 99999999);
  const playgroundDir = path.resolve(__dirname, '../playground-' + id )

  async function setup() {
    fsExtra.mkdirpSync(playgroundDir);
    chdir(playgroundDir);
  }

  function cleanup() {
    chdir(originalDir);
    if (!procrastinateCleanup) {
      fsExtra.removeSync(playgroundDir);
    }
  }

  try {
    await setup();
    await testFunction(new TestInstance());
  } catch (err) {
    throw err;
  } finally {
    cleanup();
  }
}