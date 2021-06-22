const { ArgumentMetadata, ArgumentType } = require('../../../../../src/models/commands/argumentmetadata');

/**
 * VerticalAdder represents the `vertical` custom jambo command. The command adds
 * a new page for the given Vertical and associates a card type with it.
 */
class VerticalAdder {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * @returns {string} the alias for the add vertical command.
   */
  static getAlias() {
    return 'vertical';
  }

  /**
   * @returns {string} a short description of the add vertical command.
   */
  static getShortDescription() {
    return 'create the page for a vertical';
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} description of each argument for 
   *                                             the add vertical command, keyed by name
   */
  static args() {
    return {
      name: new ArgumentMetadata(
        ArgumentType.STRING, 'name of the vertical\'s page', true),
      verticalKey: new ArgumentMetadata(ArgumentType.STRING, 'the vertical\'s key', true),
      cardName: new ArgumentMetadata(
        ArgumentType.STRING, 'card to use with vertical', false),
      template: new ArgumentMetadata(
        ArgumentType.STRING, 'page template to use within theme', true),
      locales: new ArgumentMetadata(
        ArgumentType.ARRAY,
        'additional locales to generate the page for',
        false,
        [],
        ArgumentType.STRING)
    };
  }

  /**
   * @returns {Object} description of the vertical command and its parameters.
   */
  static describe(jamboConfig) {
    return {
      displayName: 'Add Vertical',
      params: {
        name: {
          displayName: 'Page Name',
          required: true,
          type: 'string'
        },
        verticalKey: {
          displayName: 'Vertical Key',
          required: true,
          type: 'string',
        },
        cardName: {
          displayName: 'Card Name',
          type: 'singleoption'
        },
        template: {
          displayName: 'Page Template',
          required: true,
          type: 'singleoption'
        },
        locales: {
          displayName: 'Additional Page Locales',
          type: 'multioption'
        }
      }
    };
  }

    /**
   * Executes the add vertical command with the provided arguments.
   * 
   * @param {Object<string, string>} args The arguments, keyed by name 
   */
     execute(args) {
        this._validateArgs(args);
        this._createVerticalPage(args.name, args.template, args.locales);
        const cardName = args.cardName || this._getCardDefault(args.template);
        this._configureVerticalPage(args.name, args.verticalKey, cardName);
      }

}
module.exports = VerticalAdder;