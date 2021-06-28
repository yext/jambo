const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');

/**
 * Gets the repo name from a git repo URL
 * @param {string} repoURL
 */
exports.getRepoNameFromURL = function(repoURL) {
  return path.basename(repoURL, '.git');
}

/**
 * Reads a gitignore.
 * 
 * @return {Array<string>}
 */
exports.readGitignorePaths = function() {
  if (fsExtra.pathExistsSync('.gitignore')) {
    const ignoredPaths = fs.readFileSync('.gitignore', 'utf-8');
    return ignoredPaths.split('\n').filter(pathname => pathname);
  }
  return [];
}
