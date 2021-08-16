import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

/**
 * Gets the repo name from a git repo URL
 * @param {string} repoURL
 */
export const getRepoNameFromURL = function(repoURL) {
  return path.basename(repoURL, '.git');
};

/**
 * Reads a gitignore.
 * 
 * @return {Array<string>}
 */
export const readGitignorePaths = function() {
  if (fsExtra.pathExistsSync('.gitignore')) {
    const ignoredPaths = fs.readFileSync('.gitignore', 'utf-8');
    return ignoredPaths.split('\n').filter(pathname => pathname);
  }
  return [];
};
