// const {
//   ArgumentMetadata
// } = require('../../../../../src/models/commands/argumentmetadata');
const fs = require('fs');

/**
 * VerticalAdder represents the `vertical` custom jambo command. The command adds
 * a new page for the given Vertical and associates a card type with it.
 */
module.exports = class VerticalAdder {
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
      name: {
        itemType: 'string', 
        description: 'name of the vertical\'s page', 
        isRequired: true
      },
      verticalKey: {
        itemType: 'string', 
        description: 'the vertical\'s key', 
        isRequired: true
      },
      cardName: {
        itemType: 'string', 
        description: 'card to use with vertical', 
        isRequired: false
      },
      template: {
        itemType: 'string',
        description: 'page template to use within theme',
        isRequired: true
      },
      locales: {
        type: 'array',
        description: 'additional locales to generate the page for',
        isRequired: false,
        defaultValue: [],
        itemType: 'string'
      }
    };
  }

  /**
   * @returns {Object} description of the vertical command and its parameters.
   */
  static describe() {
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
 * Executes a command that creates an html file.
 * 
 * @param {Object<string, string>} args The arguments, keyed by name 
 */
  execute(args) {
    const content = args.name + args.template + args.verticalKey;
    fs.writeFileSync('index.html', content);
  }
}
