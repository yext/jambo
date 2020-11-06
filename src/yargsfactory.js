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

    this._commandRegistry.getCommands().forEach(commandClass => {
      cli.command(this._createCommandModule(commandClass));
    });
    cli.strict()

    return cli;
  }

  /**
   * @param {Class} commandClass A Jambo {@link Command}'s class.
   * @returns {Object<string, ?>} The {@link yargs} CommandModule for the {@link Command}.
   */
  _createCommandModule(commandClass) {
    return {
      command: commandClass.getAlias(),
      desc: commandClass.getShortDescription(),
      builder: yargs => {
        Object.entries(commandClass.args()).forEach(([name, metadata]) => {
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
        const commandInstance = this._createCommandInstance(commandClass);
        commandInstance.execute(argv);
      }
    }
  }

  /**
   * @param {Class} commandClass the class of the Jambo command
   * @returns {Command} the instantiated Jambo command
   */
  _createCommandInstance(commandClass) {
    const className = commandClass.name;
    let commandInstance;
    switch (className) {
      case 'DescribeCommand':
        commandInstance = new commandClass(
          this._jamboConfig, 
          () => this._commandRegistry.getCommands()
        );
        break;
      case 'PageCommand':
        const pageScaffolder = new PageScaffolder(this._jamboConfig);
        commandInstance = new commandClass(this._jamboConfig, pageScaffolder);
        break;
      case 'BuildCommand':
        const sitesGenerator = new SitesGenerator(this._jamboConfig);
        commandInstance = new commandClass(sitesGenerator);
        break;
      default:
        commandInstance = new commandClass(this._jamboConfig);
    }
    return commandInstance;
  }
}
module.exports = YargsFactory;