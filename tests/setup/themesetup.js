import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import { chdir, cwd } from 'process';
import simpleGit from 'simple-git/promise';

const testThemesDir = path.resolve(__dirname, '../acceptance/test-themes');

/**
 * Transform all theme folders under test-themes/ into git repos.
 */
export const setupTestThemes = async function() {
  async function initGitRepo(dir) {
    const originalDir = cwd();
    chdir(dir);
    const git = simpleGit(dir)
    await git.init();
    await git.add('-A');
    await git.commit('init test theme');
    chdir(originalDir);
  }
  const testThemes = fs.readdirSync(testThemesDir);
  for (const themeName of testThemes) {
    await initGitRepo(path.resolve(testThemesDir, themeName));
  }
};

/**
 * Transform all theme folders under test-themes back into regular folders,
 * so they can be tracked properly by jambo's git repo.
 */
export const cleanupTestThemes = function() {
  const testThemes = fs.readdirSync(testThemesDir);
  testThemes.forEach(themeName => {
    const themeGitFolder = path.resolve(testThemesDir, themeName, '.git');
    fsExtra.removeSync(themeGitFolder);
  });
};