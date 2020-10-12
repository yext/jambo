const Descriptions = require('./descriptions');
const RepoAnalyzer = require('./repoanalyzer');

/**
 * CommandDescriber outputs JSON that describes all registered Jambo commands
 * and their possible arguments.
 */
class CommandDescriber {
  constructor(repoAnalyzer) {
    /**
     * @type {RepoAnalyzer}
     */
    this.repoAnalyzer = repoAnalyzer;
  }

  describe() {
    const descriptions = this._getCommandDescriptions();
    console.dir(descriptions, {
      depth: null,
      maxArrayLength: null
    });
  }

  _getCommandDescriptions() {
    const themes = this.repoAnalyzer.getThemes();
    const pageTemplates = this.repoAnalyzer.getPageTemplates();
    const themeFiles = this.repoAnalyzer.getThemeFiles();
    const cards = this.repoAnalyzer.getCards();
    const daCards = this.repoAnalyzer.getDirectAnswerCards();
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