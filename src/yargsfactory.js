const yargs = require('yargs');

const initCommand = require('./commands/init/repositoryscaffolder');
const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const overrideCommand = require('./commands/override/themeshadower');
const themeCommand = require('./commands/import/themeimporter');
const { ThemeUpgrader } = require('./commands/upgrade/themeupgrader');
const SystemError = require('./errors/systemerror');
const UserError = require('./errors/usererror');
const { isCustomError } = require('./utils/errorutils');

/**
 * Creates the {@link yargs} instance that powers the Jambo CLI.
 */
class YargsFactory {
  constructor(commandRegistry) {
    this._commandRegistry = commandRegistry;
  }

  /**
   * Generates a {@link yargs} instance with all of the built-in and custom
   * commands known to Jambo. 
   */
  createCLI(jamboConfig) {
    const cli = yargs.usage('Usage: $0 <cmd> <operation> [options]');
    
    this._addBuiltInCommands(cli, jamboConfig);
    this._commandRegistry.getCommands().forEach(command => {
      cli.command(this._createCommandModule(command));
    });
    cli.strict()

    return cli;
  }

  /**
   * Adds all of the built-in Jambo commands to {@link yargs}. This method will
   * be removed once all these commands are supported in the {@link CommandRegistry}.
   * 
   * @param {yargs} yargs The {@link yargs} instance.
   * @param {Object<string, ?>} jamboConfig The parsed Jambo configuration.
   */
  _addBuiltInCommands(yargs, jamboConfig) {
    yargs
      .command(
        'init',
        'initialize the repository',
        yargs => {
          return yargs
            .option('theme', { description: 'a starter theme' })
            .option(
              'addThemeAsSubmodule',
              {
                description: 'if starter theme should be imported as submodule',
                default: true,
                type: 'boolean'
              }
            );
        },
        argv => {
          const repositorySettings = new initCommand.RepositorySettings(argv);
          const repositoryScaffolder = new initCommand.RepositoryScaffolder();
          repositoryScaffolder.create(repositorySettings);
        })
      .command(
        'import',
        'import a theme',
        yargs => {
          return yargs
            .option('theme', { description: 'theme to import', demandOption: true })
            .option(
              'addAsSubmodule',
              {
                description: 'import the theme as a submodule',
                default: true,
                type: 'boolean'
              }
            );
        },
        argv => {
          const themeImporter = new themeCommand.ThemeImporter(jamboConfig);
          themeImporter.import(argv.theme, argv.addAsSubmodule)
            .then(console.log);
        })
      .command(
        'override',
        'override a path within the theme',
        yargs => {
          return yargs
            .option(
              'path',
              { description: 'path in the theme to override', demandOption: true })
        },
        argv => {
          const shadowConfiguration = new overrideCommand.ShadowConfiguration(
            { ...argv, theme: jamboConfig.defaultTheme });
          const themeShadower = new overrideCommand.ThemeShadower(jamboConfig);
          themeShadower.createShadow(shadowConfiguration);
        })
      .command(
        'page',
        'add a new page to the site',
        yargs => {
          return yargs
            .option('name', { description: 'name for the new files', demandOption: true })
            .option('layout', { description: 'layout to use with page' })
            .option('template', { description: 'template to use within theme' });
        },
        argv => {
          const pageConfiguration = new addPageCommand.PageConfiguration(
            { ...argv, theme: jamboConfig.defaultTheme });
          const pageScaffolder = new addPageCommand.PageScaffolder(jamboConfig);
          try {
            pageScaffolder.create(pageConfiguration);
          } catch (err) {
            throw new UserError('Failed to add page', err.stack);
          }
        })
      .command(
        'build',
        'build the static pages for the site',
        yargs => {
          return yargs
            .option(
              'jsonEnvVars',
              { description: 'environment variables containing JSON', type: 'array' });
        },
        argv => {
          const sitesGenerator = new buildCommand.SitesGenerator(jamboConfig);
          try {
            sitesGenerator.generate(argv.jsonEnvVars);
          } catch (err) {
            if (isCustomError(err)) {
              throw err;
            }
            throw new UserError('Failed to generate the site', err.stack);
          }

        })
      .command(
        'upgrade',
        'upgrade the default theme to the latest version',
        yargs => {
          return yargs
            .option('disableScript', {
              description: 'disable execution of ./upgrade.js after the upgrade is done',
              type: 'boolean'
            })
            .option('isLegacy', {
              description: 'whether to pass the --isLegacy flag to ./upgrade.js',
              type: 'boolean'
            })
        },
        argv => {
          const themeUpgrader = new ThemeUpgrader(jamboConfig);
          themeUpgrader
            .upgrade(jamboConfig.defaultTheme, argv.disableScript, argv.isLegacy)
            .catch(err => {
              if (isCustomError(err)) {
                throw err;
              }
              throw new SystemError(err.message, err.stack);
            });
        });
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
      handler: argv => command.execute(argv)
    }
  }
}
module.exports = YargsFactory;