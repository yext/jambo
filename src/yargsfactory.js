const yargs = require('yargs');
const PageScaffolder = require('./commands/page/add/pagescaffolder');
const SitesGenerator = require('./commands/build/sitesgenerator');


/**
 * Creates the {@link yargs} instance that powers the Jambo CLI.
 */
class YargsFactory {
  constructor(commandRegistry, jamboConfig) {
    this._commandRegistry = commandRegistry;
    this._jamboConfig = jamboConfig;
  }

  /**
   * Generates a {@link yargs} instance with all of the built-in and custom
   * commands known to Jambo. 
   */
  createCLI() {
    const cli = yargs.usage('Usage: $0 <cmd> <operation> [options]');

    this._commandRegistry.getCommands().forEach(commandClazz => {
      cli.command(this._createCommandModule(commandClazz));
    });
    cli.strict()

    return cli;
  }

  /**
   * @param {Class} commandClazz A Jambo {@link Command}'s class'.
   * @returns {Object<string, ?>} The {@link yargs} CommandModule for the {@link Command}.
   */
  _createCommandModule(commandClazz) {
    return {
      command: commandClazz.getAlias(),
      desc: commandClazz.getShortDescription(),
      builder: yargs => {
        Object.entries(commandClazz.args()).forEach(([name, metadata]) => {
          yargs.option(
            name,
            {
              type: metadata.getType(),
              description: metadata.getDescription(),
              demandOption: metadata.isRequired(),
              default: metadata.defaultValue()
            });
        });
      },
      handler: argv => {
        const commandName = commandClazz.name;
        const commandInstance = this._getCommandInstance(commandName, commandClazz);
        commandInstance.execute(argv);
      }
    }
  }

  /**
   * @param {String} commandName the name of the Jambo command's class
   * @param {Class} commandCLazz the class of the Jambo command
   * @returns {Command} the instantiated Jambo command
   */
  _getCommandInstance(commandName, commandClazz) {
    let commandInstance;
    switch (commandName) {
      case 'DescribeCommand':
        commandInstance = new commandClazz(
          this._jamboConfig, 
          () => this._commandRegistry.getCommands()
        );
        break;
      case 'PageCommand':
        const pageScaffolder = new PageScaffolder(this._jamboConfig);
        commandInstance = new commandClazz(this._jamboConfig, pageScaffolder);
        break;
      case 'BuildCommand':
        const sitesGenerator = new SitesGenerator(this._jamboConfig);
        commandInstance = new commandClazz(sitesGenerator);
        break;
      default:
        commandInstance = new commandClazz(this._jamboConfig);
    }
    return commandInstance;
  }
}
module.exports = YargsFactory;