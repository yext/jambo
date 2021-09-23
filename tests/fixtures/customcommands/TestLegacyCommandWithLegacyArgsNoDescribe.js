const { LegacyArgumentMetadata, LegacyArgumentType } = require('./LegacyArgumentMetadata');

/**
 * An LegacyCommand implementation for unit tests without a describe method.
 * This is an example of our second version of custom commands. This version updated the
 * Command interface to have static methods for all methods except execute, but
 * still uses ArgumentMetadata with getters.
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

  execute() {}
}
