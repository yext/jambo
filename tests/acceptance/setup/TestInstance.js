const buildJamboCLI = require('../../../src/buildJamboCLI');
const parse = require('shell-quote').parse;

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
    return new Promise((resolve, reject) => {
      try {
        buildJamboCLI(argv)
          .scriptName('jambo')
          .onFinishCommand(async (r) => resolve(r))
          .exitProcess(false)
          .parse(commandArgs);
      } catch (err) {
        reject(err);
      }
    });
  }
}