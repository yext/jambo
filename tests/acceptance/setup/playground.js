const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { chdir, cwd } = require('process');
const TestInstance = require('./TestInstance');
const simpleGit = require('simple-git/promise');

/**
 * Transform all theme folders under test-themes/ into git repos.
 */
async function setupTestThemes() {
  async function initGitRepo(dir) {
    const originalDir = cwd();
    chdir(dir);
    const git = simpleGit(dir)
    await git.init();
    await git.add('-A');
    await git.commit('init test theme');
    chdir(originalDir);
  }
  const testThemesDir = path.resolve(__dirname, '../test-themes');
  const testThemes = fs.readdirSync(testThemesDir);
  for (const themeName of testThemes) {
    await initGitRepo(path.resolve(testThemesDir, themeName));
  }
}

/**
 * Transform all theme folders under test-themes back into regular folders,
 * so they can be tracked properly by jambo's git repo.
 */
function cleanupTestThemes() {
  const testThemesDir = path.resolve(__dirname, '../test-themes');
  const testThemes = fs.readdirSync(testThemesDir);
  testThemes.forEach(themeName => {
    const themeGitFolder = path.resolve(testThemesDir, themeName, '.git');
    fsExtra.removeSync(themeGitFolder);
  });
}

/**
 * Runs a test suite in a playground-[id] folder.
 *
 * @param {Function} testFunction 
 */
exports.runInPlayground = async function(testFunction) {
  const originalDir = cwd();
  const id = parseInt(Math.random() * 99999999);
  const playgroundDir = path.resolve(__dirname, '../playground-' + id )

  async function setup() {
    fsExtra.mkdirpSync(playgroundDir);
    await setupTestThemes();
    chdir(playgroundDir);
  }

  function cleanup() {
    chdir(originalDir);
    cleanupTestThemes();
    fsExtra.removeSync(playgroundDir);
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