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

    this._commandRegistry.getCommands().forEach(command => {
      cli.command(this._createCommandModule(command));
    });
    cli.strict()

    return cli;
  }

  /**
   * @param {Command} command A Jambo {@link Command}.
   * @returns {Object<string, ?>} The {@link yargs} CommandModule for the {@link Command}.
   */
  _createCommandModule(command) {
    return {
      command: command.getAlias(),
      desc: command.getShortDescription(),
      builder: yargs => {
        Object.entries(command.args()).forEach(([name, metadata]) => {
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
        const commandName = command.name;
        let commandInstance;
        switch (commandName) {
          case 'DescribeCommand':
            commandInstance = new command(
              this._jamboConfig, 
              () => this._commandRegistry.getCommands()
            );
            break;
          case 'PageCommand':
            const pageScaffolder = new PageScaffolder(this._jamboConfig);
            commandInstance = new command(this._jamboConfig, pageScaffolder);
            break;
          case 'BuildCommand':
            const sitesGenerator = new SitesGenerator(this._jamboConfig);
            commandInstance = new command(sitesGenerator);
            break;
          default:
            commandInstance = new command(this._jamboConfig);
        }
        commandInstance.execute(argv);
      }
    }
  }
}
module.exports = YargsFactory;