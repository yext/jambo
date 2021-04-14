const path = require('path');

/**
 * Gets the repo name from a git repo URL
 * @param {string} repoURL
 */
exports.getRepoNameFromURL = function(repoURL) {
  return path.basename(repoURL, '.git');
}
