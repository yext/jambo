const fs = require('fs-extra');
const { addToPartials } = require('../../utils/jamboconfigutils');
const path = require('path');
const UserError = require('../../errors/usererror')

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
        `${this.config.dirs.themes}/${defaultTheme}/${this._customCardsDir}`;

    const cardFolderName = cardName.toLowerCase();
    const isFolderInUse = 
        fs.existsSync(`${themeCardsDir}/${cardFolderName}`) ||
        fs.existsSync(`${this._customCardsDir}/${cardFolderName}`);
    if (isFolderInUse) {
        throw new UserError(`A folder with name ${cardFolderName} already exists`);
    }

    const cardFolder = `${this._customCardsDir}/${cardFolderName}`;
    if (fs.existsSync(templateCardFolder)) {
        !fs.existsSync(this._customCardsDir) && this._createCustomCardsDir();
        fs.copySync(templateCardFolder, cardFolder);
        this._renameCardComponent(cardFolderName, cardFolder);
    } else {
        throw new UserError(`The folder ${templateCardFolder} does not exist`);
    }
  }

  _renameCardComponent(customCardName, cardFolder) {
    const cardComponentPath = path.resolve(cardFolder, 'component.js');
    const originalComponent = fs.readFileSync(cardComponentPath).toString();
    const renamedComponent = 
      this._getRenamedCardComponent(originalComponent, customCardName);
    fs.writeFileSync(cardComponentPath, renamedComponent);
  }

  /**
   * Returns the internal contents for a newly-created card, updated based on
   * the given customCardName. (e.g. StandardCardComponent -> [CustomName]CardComponent)
   * @param {string} content
   * @param {string} customCardName
   * @returns {string}
   */
  _getRenamedCardComponent(content, customCardName) {
    const cardNameSuffix = 'CardComponent';
    const registerComponentTypeRegex = /\([\w_]+CardComponent\)/g;
    const regexArray = Array.from(content.matchAll(/componentName\s*=\s*'(.*)'/g));
    if (regexArray.length === 0 || regexArray[0].length < 2) {
      return content;
    }
    const originalComponentName = regexArray[0][1];

    const customComponentClassName =
      customCardName.replace(/-/g, '_') + cardNameSuffix;

    return content
      .replace(/class (.*) extends/g, `class ${customComponentClassName} extends`)
      .replace(registerComponentTypeRegex, `(${customComponentClassName})`)
      .replace(new RegExp(originalComponentName, 'g'), customCardName)
      .replace(/cards[/_](.*)[/_]template/g, `cards/${customCardName}/template`);
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