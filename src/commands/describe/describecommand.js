const Descriptions = require('./descriptions');
const DescribeCommandRepoReader = require('./describecommandreporeader');

/**
 * DescribeCommand outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
module.exports = class DescribeCommand {
  constructor(getCommands, repoReader) {
    this.getCommands = getCommands;
    /**
     * @type {DescribeCommandRepoReader}
     */
    this.repoReader = repoReader;
  }

  getAlias() {
    return 'describe';
  }

  getShortDescription() {
    return 'describe all the registered jambo commands and their possible arguments';
  }

  args() {
    return {};
  }

  /**
   * The describe command filters its own describe out of the jambo describe output.
   */
  describe() {
    return {};
  }

  execute() {
    const builtInDescriptions = this._getBuiltInDescriptions();
    const commandModuleDescriptions = this._getCommandModuleDescriptions();
    const descriptions = { ...builtInDescriptions, ...commandModuleDescriptions};
    console.dir(descriptions, {
      depth: null,
      maxArrayLength: null
    });
  }

  _getCommandModuleDescriptions() {
    const customDescriptions = {};
    for (const command of this.getCommands()) {
      if (command.getAlias() !== 'describe') {
        customDescriptions[command.getAlias()] = command.describe();
      }
    }
    return customDescriptions;
  }

  _getBuiltInDescriptions() {
    const importableThemes = this.repoReader.getImportableThemes();
    const pageTemplates = this.repoReader.getPageTemplates();
    const themeFiles = this.repoReader.getThemeFiles();
    const cards = this.repoReader.getCards();
    const daCards = this.repoReader.getDirectAnswerCards();
    return {
      init: Descriptions.init(importableThemes),
      page: Descriptions.page(pageTemplates),
      import: Descriptions.import(importableThemes),
      override: Descriptions.override(themeFiles),
      upgrade: Descriptions.upgrade(),
      build: Descriptions.build(),
      card: Descriptions.card(cards),
      directanswercard: Descriptions.directanswercard(daCards)
    }
  }
}
