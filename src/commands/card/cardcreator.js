const fs = require('fs-extra');
const { addToPartials } = require('../../utils/jamboconfigutils');

exports.CardCreator = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._customCardsDir = 'cards';
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

    const cardFolderName = cardName.toLowerCase();
    const isFolderInUse = 
        fs.existsSync(`${themeCardsDir}/${cardFolderName}`) ||
        fs.existsSync(`${this._customCardsDir}/${cardFolderName}`);
    if (isFolderInUse) {
        console.error(`A folder with name ${cardFolderName} already exists`);
        return;
    }

    const cardFolder = `${this._customCardsDir}/${cardFolderName}`;
    if (fs.existsSync(templateCardFolder)) {
        !fs.existsSync(this._customCardsDir) && this._createCustomCardsDir();
        fs.copySync(templateCardFolder, cardFolder);
    } else {
        console.error(`The folder ${templateCardFolder} does not exist`);
        return;
    }
  }

  /**
   * Creates the 'cards' directory in the Jambo repository and adds the newly 
   * created directory to the list of partials in the Jambo config.
   */
  _createCustomCardsDir() {
    fs.mkdirSync(this._customCardsDir);
    addToPartials(this._customCardsDir);  
  }
}