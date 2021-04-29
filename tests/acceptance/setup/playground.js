const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { chdir, cwd } = require('process');
const { runCommand } = require('./utils');

/**
 * Transform all theme folders under test-themes/ into git repos.
 */
function setupTestThemes() {
  function initGitRepo(dir) {
    const originalDir = cwd();
    chdir(dir);
    runCommand('git init');
    runCommand('git add -A');
    runCommand('git commit -m "test theme"');
    chdir(originalDir);
  }
  const testThemesDir = path.resolve(__dirname, '../test-themes');
  const testThemes = fs.readdirSync(testThemesDir);
  testThemes.forEach(themeName => {
    initGitRepo(path.resolve(testThemesDir, themeName));
  });
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