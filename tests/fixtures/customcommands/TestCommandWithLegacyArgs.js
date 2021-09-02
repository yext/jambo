const { LegacyArgumentMetadata, LegacyArgumentType } = require('./LegacyArgumentMetadata');

/**
 * An LegacyCommand implementation for unit tests.
 * This is an example of our VERY FIRST version of custom commands, before updating all methods but
 * execute into static methods.
 */
module.exports = class CommandClass {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  static getAlias() {
    return 'TestCommandWithLegacyArgs'
  }

  static getShortDescription() {
    return 'a command with legacy args';
  }

  static args() {
    return {
      stringParam: new LegacyArgumentMetadata(LegacyArgumentType.STRING, 'some string param', true),
      arrayOfStrings: new LegacyArgumentMetadata(
        LegacyArgumentType.ARRAY, 'an array of strings param', false, [], LegacyArgumentType.STRING)
    }
  }

  static describe() {}

  execute() {}
}
