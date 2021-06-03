const fs = require('file-system');
const path = require('path');
const { parseJamboConfig } = require('./utils/jamboconfigutils');
const CommandRegistry = require('./commands/commandregistry');
const YargsFactory = require('./yargsfactory');
const CommandImporter = require('./commands/commandimporter');
const { error } = require('./utils/logger');

/**
 * @param {string[]} argv the argv for the current process
 * @returns {import('yargs').Argv} A fully built Jambo CLI instance.
 */
module.exports = function buildJamboCLI(argv) {
  const jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();
  const commandRegistry = new CommandRegistry();

  if (argv.length < 3) {
    error('You must provide Jambo with a command.');
    return;
  }

  const shouldParseCustomCommands =
    shouldImportCustomCommands(argv[2], commandRegistry);
  const canParseCustomCommands =
    jamboConfig && jamboConfig.dirs && jamboConfig.dirs.output;

  if (shouldParseCustomCommands && canParseCustomCommands) {
    importCustomCommands(jamboConfig, commandRegistry);
  }

  const yargsFactory = new YargsFactory(commandRegistry, jamboConfig);
  return yargsFactory.createCLI();
}

/**
 * Determines if custom {@link Command}s should be imported and added to the CLI instance.
 * 
 * @param {string} invokedCommand The Jambo command that was invoked from the 
 *                                command line.
 * @param {CommandRegistry} commandRegistry The registry containing all built-in commands.
 * @returns {boolean} If custom {@link Command}s need to be added to the CLI instance.    
 */
function shouldImportCustomCommands(invokedCommand, commandRegistry) {
  const isCustomCommand =
    !commandRegistry.getAliases().includes(invokedCommand) &&
    !invokedCommand.startsWith('--');

  return invokedCommand === '--help' ||
    invokedCommand === 'describe' ||
    isCustomCommand;
}

/**
 * Imports custom commands from the Theme and the top-level of the site repository.
 * The imported commands are added to the provided {@link CommandRegistry}.
 * 
 * @param {Object} jamboConfig The site's parsed Jambo configuration.
 * @param {CommandRegistry} commandRegistry The existing registry of built-in commands.
 */
function importCustomCommands(jamboConfig, commandRegistry) {
  const commandImporter = jamboConfig.defaultTheme ?
    new CommandImporter(
      jamboConfig.dirs.output,
      path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme)) :
    new CommandImporter(jamboConfig.dirs.output);

  commandImporter.import().forEach(customCommand => {
    commandRegistry.addCommand(customCommand)
  });
}
