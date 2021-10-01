import fs from 'fs';
import path from 'path';
import { parseJamboConfig } from './utils/jamboconfigutils';
import CommandRegistry from './commands/commandregistry';
import YargsFactory from './yargsfactory';
import CommandImporter from './commands/commandimporter';
import { error } from './utils/logger';
import { JamboConfig } from './models/JamboConfig';

/**
 * @param {string[]} argv the argv for the current process
 * @returns {import('yargs').Argv} A fully built Jambo CLI instance.
 */
export default function buildJamboCLI(argv: string[]) {
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
function shouldImportCustomCommands(invokedCommand: string, commandRegistry: CommandRegistry) {
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
function importCustomCommands(jamboConfig: JamboConfig, commandRegistry: CommandRegistry) {
  const commandImporter = jamboConfig.defaultTheme ?
    new CommandImporter(
      jamboConfig.dirs.output,
      path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme)) :
    new CommandImporter(jamboConfig.dirs.output);

  commandImporter.import().forEach(customCommand => {
    commandRegistry.addCommand(customCommand);
  });
}
