const yargs = require('yargs');
const PageScaffolder = require('./commands/page/add/pagescaffolder');
const SitesGenerator = require('./commands/build/sitesgenerator');
const { ArgumentMetadata, ArgumentType } = require('./models/commands/argumentmetadata');
const { info, error } = require('./utils/logger');
const { exitWithError } = require('./utils/errorutils');

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
  _createCommandModule(commandClass) {
    return {
      command: commandClass.getAlias(),
      desc: commandClass.getShortDescription(),
      builder: yargs => {
        Object.entries(commandClass.args()).forEach(([name, metadata]) => {
          if (metadata.getType() === ArgumentType.ARRAY) {
            this._addListOption(name, metadata, yargs);
          } else {
            yargs.option(
              name,
              {
                type: metadata.getType(),
                description: metadata.getDescription(),
                demandOption: metadata.isRequired(),
                default: metadata.defaultValue()
              });
          }
        });
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
   * @param {ArgumentMetadata} metadata The option's {@link ArgumentMetadata}.
   * @param {import('yargs').Argv} yargs The Yargs instance to modify.
   */
  _addListOption(name, metadata, yargs) {
    yargs.array(name);
    const defaultValue = metadata.defaultValue() || [];

    metadata.isRequired() && yargs.demandOption(name);
    yargs.default(name, defaultValue);
    yargs.describe(name, metadata.getDescription());
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