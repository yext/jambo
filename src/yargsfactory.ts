import yargs, { CommandModule } from 'yargs';
import PageScaffolder from './commands/page/add/pagescaffolder';
import SitesGenerator from './commands/build/sitesgenerator';
import { info, error } from './utils/logger';
import { exitWithError } from './utils/errorutils';
import CommandRegistry from './commands/commandregistry';
import Command from './models/commands/command';
import { JamboConfig } from './models/JamboConfig';
import DescribeCommand from './commands/describe/describecommand';
import PageCommand from './commands/page/add/pagecommand';
import BuildCommand from './commands/build/buildcommand';
import { ArgumentMetadata } from './models/commands/argumentmetadata';

/**
 * Creates the {@link yargs} instance that powers the Jambo CLI.
 */
class YargsFactory {
  private _commandRegistry: CommandRegistry
  private _jamboConfig: JamboConfig

  constructor(commandRegistry: CommandRegistry, jamboConfig: JamboConfig) {
    this._commandRegistry = commandRegistry;
    this._jamboConfig = jamboConfig;
  }

  /**
   * Generates a {@link yargs} instance with all of the built-in and custom
   * commands known to Jambo. 
   * 
   * @returns {import('yargs').Argv}
   */
  createCLI() {
    const cli = yargs
      .usage('Usage: $0 <cmd> <operation> [options]')
      .fail((msg, err, yargs) => {
        info(yargs.help());
        if (msg) error(msg);
        exitWithError(err);
      });

    this._commandRegistry.getCommands().forEach(commandClass => {
      cli.command(this._createCommandModule(commandClass));
    });
    cli.strict();

    return cli;
  }

  /**
   * @param {Class} commandClass A Jambo {@link Command}'s class.
   * @returns {Object<string, ?>} The {@link yargs} CommandModule for the {@link Command}.
   */
  _createCommandModule(commandClass: Command<any>): CommandModule {
    return {
      command: commandClass.getAlias(),
      describe: commandClass.getShortDescription(),
      builder: yargs => {
        Object.entries(commandClass.args()).forEach(([name, argMetadata]: [string, ArgumentMetadata | any]) => {
          let metadata = argMetadata;
          if(metadata.hasOwnProperty('_type')) {
            metadata = {
              type: argMetadata.getType(),
              description: argMetadata.getDescription(),
              demandOption: argMetadata.isRequired(),
              default: argMetadata.defaultValue()
            }
          }
          if (metadata.type === 'array') {
            this._addListOption(name, metadata, yargs);
          } else {
            yargs.option<string, any>(
              name,
              {
                type: metadata.type,
                description: metadata.description,
                demandOption: metadata.isRequired,
                default: metadata.defaultValue
              });
          }
        });
        return yargs;
      },
      handler: async argv => {
        const commandInstance = this._createCommandInstance(commandClass);
        await commandInstance.execute(argv);
      }
    }
  }

  /**
   * Adds an Array-type option to the provided Yargs instance. Note that this type of
   * option cannot be added with 'yargs.option'.
   * 
   * @param {string} name The name of the option.
   * @param {ArgumentMetadataImpl} metadata The option's {@link ArgumentMetadataImpl}.
   * @param {import('yargs').Argv} yargs The Yargs instance to modify.
   */
  _addListOption(name: string, metadata: ArgumentMetadata, yargs: import('yargs').Argv) {
    yargs.array(name);
    const defaultValue = metadata.defaultValue || [];

    metadata.isRequired && yargs.demandOption(name);
    yargs.default(name, defaultValue);
    yargs.describe(name, metadata.description);
  }

  /**
   * @param {Class} commandClass the class of the Jambo command
   * @returns {Command} the instantiated Jambo command
   */
  _createCommandInstance(commandClass) {
    const classAlias = commandClass.getAlias();
    let commandInstance;
    switch (classAlias) {
      case DescribeCommand.getAlias():
        commandInstance = new commandClass(
          this._jamboConfig, 
          () => this._commandRegistry.getCommands()
        );
        break;
      case PageCommand.getAlias():
        const pageScaffolder = new PageScaffolder(this._jamboConfig);
        commandInstance = new commandClass(this._jamboConfig, pageScaffolder);
        break;
      case BuildCommand.getAlias():
        const sitesGenerator = new SitesGenerator(this._jamboConfig);
        commandInstance = new commandClass(sitesGenerator);
        break;
      default:
        commandInstance = new commandClass(this._jamboConfig);
    }
    return commandInstance;
  }
}
export default YargsFactory;