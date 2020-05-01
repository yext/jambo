#!/usr/bin/env node

const initCommand = require('./commands/init/repositoryscaffolder');
const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const overrideCommand = require('./commands/override/themeshadower');
const themeCommand = require('./commands/import/themeimporter');
const addCardCommand = require('./commands/card/cardcreator');
const { parseJamboConfig } = require('./utils/jamboconfigutils');
const yargs = require('yargs');
const fs = require('file-system');

const jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();

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
      repositoryScaffolder.create(repositorySettings).catch(console.log);
    })
  .command(
    'import',
    'import a theme',
    yargs => {
      return yargs
        .option('theme', { description: 'theme to import', demandOption: true })
        .option(
          'addAsSubmodule', 
          { description: 'import the theme as a submodule', default: true, type: 'boolean' });
    },
    argv => {
      const themeImporter = new themeCommand.ThemeImporter(jamboConfig);
      themeImporter.import(argv.theme, argv.addAsSubmodule).then(console.log).catch(console.log);
    })
  .command(
    'override',
    'override a path within the theme',
    yargs => {
      return yargs
        .option('path', { description: 'path in the theme to override', demandOption: true })
    },
    argv => {
      const shadowConfiguration = 
        new overrideCommand.ShadowConfiguration(addThemeToArgs(argv));
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
      const pageConfiguration = 
        new addPageCommand.PageConfiguration(addThemeToArgs(argv));
      const pageScaffolder = new addPageCommand.PageScaffolder(jamboConfig);
      pageScaffolder.create(pageConfiguration);
    })
  .command(
    'card',
    'add a new card for use in the site',
    yargs => {
      return yargs
        .option('name', { description: 'name for the new card', demandOption: true })
        .option('templateCardFolder', { description: 'folder of card to fork', demandOption: true });
    },
    argv => {
      const cardCreator = new addCardCommand.CardCreator(jamboConfig);
      cardCreator.create(argv.name, argv.templateCardFolder);
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
      sitesGenerator.generate(argv.jsonEnvVars);
    })
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