#!/usr/bin/env node

const fs = require('file-system');
const path = require('path');

const { parseJamboConfig } = require('./utils/jamboconfigutils');
const { exitWithError } = require('./utils/errorutils');
const CommandRegistry = require('./commands/commandregistry');
const YargsFactory = require('./yargsfactory');
const CommandImporter = require('./commands/commandimporter');

// Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', err => {
  exitWithError(err);
});
process.on('uncaughtException', err => {
  exitWithError(err);
});

buildJamboCLI();

/**
 * @returns {Object} A fully built Jambo CLI instance.
 */
function buildJamboCLI() {
  const jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();
  const commandRegistry = new CommandRegistry();

  if (process.argv.length < 3) {
    console.error('You must provide Jambo with a command.');
    return;
  }

  const shouldParseCustomCommands = 
    shouldImportCustomCommands(process.argv[2], commandRegistry);
  const canParseCustomCommands = 
    jamboConfig && jamboConfig.dirs && jamboConfig.dirs.output;
  
  if (shouldParseCustomCommands && canParseCustomCommands) {
    importCustomCommands(jamboConfig, commandRegistry);
  }
  
  const yargsFactory = new YargsFactory(commandRegistry, jamboConfig);
  const options = yargsFactory.createCLI();
  return options.argv;
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
