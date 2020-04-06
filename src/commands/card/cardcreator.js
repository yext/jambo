const fs = require('fs-extra');

exports.CardCreator = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Creates a new, custom card in the top-level 'Cards' directory. This card
   * will be based off either an existing custom card or one supplied by the
   * Theme.
   * 
   * @param {string} cardName           The name of the new card. A folder with a
   *                                    lowercased version of this name will be
   *                                    created.
   * @param {string} templateCardFolder The folder of the existing card on which
   *                                    the new one will be based.
   */
  create(cardName, templateCardFolder) {
    const defaultTheme = this.config.defaultTheme;
    const themeCardsDir = 
        `${this.config.dirs.themes}/${defaultTheme}/cards`;
    const customCardsDir = this.config.dirs.cards;

    const cardFolderName = cardName.toLowerCase();
    const isFolderInUse = 
        fs.existsSync(`${themeCardsDir}/${cardFolderName}`) ||
        fs.existsSync(`${customCardsDir}/${cardFolderName}`);
    if (isFolderInUse) {
        console.error(`A folder with name ${cardFolderName} already exists`);
        return;
    }

    const cardFolder = `${customCardsDir}/${cardFolderName}`;
    if (fs.existsSync(templateCardFolder)) {
        fs.copySync(templateCardFolder, cardFolder);
    } else {
        console.error(`The folder ${templateCardFolder} does not exist`);
        return;
    }
  }
}