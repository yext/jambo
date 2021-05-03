const buildJamboCLI = require('../../../src/buildJamboCLI');
const { parse } = require('shell-quote');

/**
 * TestInstance gives Jambo acceptance tests different ways
 * to interact with the testing playground.
 *
 * TODO: use yargs.parseAsync instead of yargs.parse when it comes out in yargs@17
 */
module.exports = class TestInstance {
  async jambo(command) {
    const commandArgs = parse(command);
    const argv = [process.argv[0], process.argv[1], ...commandArgs];

    return buildJamboCLI(argv)
      .scriptName('jambo')
      .fail(function(msg, err) {
        console.error('Error running command:', command);
        if (err) throw err
      })
      .exitProcess(false)
      .parseAsync(commandArgs);
  }
}