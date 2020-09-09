#!/usr/bin/env node

const initCommand = require('./commands/init/repositoryscaffolder');
const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const overrideCommand = require('./commands/override/themeshadower');
const themeCommand = require('./commands/import/themeimporter');
const addCardCommand = require('./commands/card/cardcreator');
const { DirectAnswerCardCreator } = require('./commands/directanswercard/directanswercardcreator');
const { ThemeUpgrader } = require('./commands/upgrade/themeupgrader');
const { parseJamboConfig } = require('./utils/jamboconfigutils');
const yargs = require('yargs');
const fs = require('file-system');
const SystemError = require('./errors/systemerror');
const UserError = require('./errors/usererror');
const { exitWithError, isCustomError } = require('./utils/errorutils');

let jamboConfig;

try {
  jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();
} catch (e) {
  exitWithError(e);
}


const options = yargs
	.usage('Usage: $0 <cmd> <operation> [options]')
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
      repositoryScaffolder.create(repositorySettings).catch(e => exitWithError(e));
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
      try {
        const themeImporter = new themeCommand.ThemeImporter(jamboConfig);
        themeImporter.import(argv.theme, argv.addAsSubmodule)
          .then(console.log)
          .catch(e => exitWithError(e));
      } catch (e) {
        exitWithError(e);
      }
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
      try {
        const shadowConfiguration = 
          new overrideCommand.ShadowConfiguration(addThemeToArgs(argv));
        const themeShadower = new overrideCommand.ThemeShadower(jamboConfig);
        themeShadower.createShadow(shadowConfiguration);
      } catch (e) {
        exitWithError(e);
      }
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
      const pageConfiguration = 
        new addPageCommand.PageConfiguration(addThemeToArgs(argv));
      const pageScaffolder = new addPageCommand.PageScaffolder(jamboConfig);
      try {
        pageScaffolder.create(pageConfiguration);
      } catch (err) {
        exitWithError(new UserError('Failed to add page', err.stack));
      }
    })
  .command(
    'card',
    'add a new card for use in the site',
    yargs => {
      return yargs
        .option('name', { description: 'name for the new card', demandOption: true })
        .option(
          'templateCardFolder', 
          { description: 'folder of card to fork', demandOption: true });
    },
    argv => {
      try {
        const cardCreator = new addCardCommand.CardCreator(jamboConfig);
        cardCreator.create(argv.name, argv.templateCardFolder);
      } catch (e) {
        exitWithError(e);
      }
    })
  .command(
    'directanswercard',
    'add a new direct answer card for use in the site',
    yargs => {
      return yargs
        .option(
          'name', 
          { description: 'name for the new direct answer card', demandOption: true })
        .option(
          'templateCardFolder',
          { description: 'folder of direct answer card to fork', demandOption: true });
    },
    argv => {
      try {
        const cardCreator = new DirectAnswerCardCreator(jamboConfig);
        cardCreator.create(argv.name, argv.templateCardFolder);
      } catch (e) {
        exitWithError(e);
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
          exitWithError(err);
        }
        exitWithError(new UserError('Failed to generate the site', err.stack));
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
            exitWithError(err);
          }
          exitWithError(new SystemError(err.message, err.stack));
        });
    })
  .strict()
  .argv;

  /**
   * Augments command line options with the defaultTheme from
   * Jambo.
   * 
   * @param {Object} argv An object containing the command line
   *                      options and the Jambo defaultTheme.
   */
  function addThemeToArgs(argv) {
    return { ...argv, theme: jamboConfig.defaultTheme };
  }
