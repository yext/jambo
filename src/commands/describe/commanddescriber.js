const Descriptions = require('./descriptions');
const DescribeCommandRepoReader = require('./describecommandreporeader');

/**
 * CommandDescriber outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
class CommandDescriber {
  constructor(jamboConfig = {}, commandRegistry) {
    this.commandRegistry = commandRegistry;
    /**
     * @type {DescribeCommandRepoReader}
     */
    this.repoReader = new DescribeCommandRepoReader(jamboConfig);
  }

  describe() {
    const builtInDescriptions = this._getBuiltInDescriptions();
    const customDescriptions = this._getCustomDescriptions();
    const descriptions = Object.assign({}, builtInDescriptions, customDescriptions);
    console.dir(descriptions, {
      depth: null,
      maxArrayLength: null
    });
  }

  _getCustomDescriptions() {
    const customDescriptions = {};
    for (const command of this.commandRegistry.getCommands()) {
      customDescriptions[command.getAlias()] = command.describe();
    }
    return customDescriptions;
  }

  _getBuiltInDescriptions() {
    const themes = this.repoReader.getThemes();
    const pageTemplates = this.repoReader.getPageTemplates();
    const themeFiles = this.repoReader.getThemeFiles();
    const cards = this.repoReader.getCards();
    const daCards = this.repoReader.getDirectAnswerCards();
    return {
      init: Descriptions.init(themes),
      page: Descriptions.page(pageTemplates),
      import: Descriptions.import(themes),
      override: Descriptions.override(themeFiles),
      upgrade: Descriptions.upgrade(),
      build: Descriptions.build(),
      card: Descriptions.card(cards),
      directanswercard: Descriptions.directanswercard(daCards)
    }
  }
}

module.exports = CommandDescriber;