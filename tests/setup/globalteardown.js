const { cleanupTestThemes } = require('./themesetup');

module.exports = async () => {
  cleanupTestThemes();
}

