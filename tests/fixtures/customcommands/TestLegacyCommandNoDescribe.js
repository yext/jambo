const { LegacyArgumentMetadata, LegacyArgumentType } = require('./LegacyArgumentMetadata');

/**
 * An LegacyCommand implementation for unit tests which does not contain describe
 * This is an example of our VERY FIRST version of custom commands, before updating all methods but
 * execute into static methods.
 */
class LegacyCommandClass {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  getAlias() {
    return 'TestLegacyCommand'
  }

  getShortDescription() {
    return 'a legacy command for unit tests';
  }

  args() {
    return {
      stringParam: new LegacyArgumentMetadata(LegacyArgumentType.STRING, 'some string param', true),
      arrayOfStrings: new LegacyArgumentMetadata(
        LegacyArgumentType.ARRAY, 'an array of strings param', false, [], LegacyArgumentType.STRING)
    }
  }

  execute() {}
}

module.exports = jamboConfig => new LegacyCommandClass(jamboConfig);