const buildJamboCLI = require('../../../src/buildJamboCLI');
const { parse } = require('shell-quote');
const { error } = require('../../../src/utils/logger');

/**
 * TestInstance gives Jambo acceptance tests different ways
 * to interact with the testing playground.
 */
module.exports = class TestInstance {
  async jambo(command) {
    const commandArgs = parse(command);
    const argv = [process.argv[0], process.argv[1], ...commandArgs];

    return buildJamboCLI(argv)
      .scriptName('jambo')
      .fail(function(msg, err) {
        error('Error running command:', command);
        if (err) throw err
      })
      .exitProcess(false)
      .parseAsync(commandArgs);
  }
}