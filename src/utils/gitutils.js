/**
 * Gets the git repo URL for the given theme name.
 * @param {string} themeName 
 */
exports.getRepoForTheme = function(themeName) {
  switch (themeName) {
    case 'answers-hitchhiker-theme':
      return 'git@github.com:yext/answers-hitchhiker-theme.git';
    default:
      throw 'Unrecognized theme';
  }
}
