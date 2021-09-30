import path from 'path';
import fsExtra from 'fs-extra';
import { chdir, cwd } from 'process';
import TestInstance from './TestInstance';

/**
 * Runs a test suite in a playground-[id] folder.
 *
 * @param {Function} testFunction
 */
export const runInPlayground = async function(testFunction, procrastinateCleanup = false) {
  const originalDir = cwd();
  const id = parseInt(Math.random() * 99999999);
  const playgroundDir = path.resolve(__dirname, '../playground-' + id );

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
};