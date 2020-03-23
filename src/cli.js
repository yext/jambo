#!/usr/bin/env node

const initCommand = require('./commands/init/repositoryscaffolder');
const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const overrideCommand = require('./commands/override/themeshadower');
const themeCommand = require('./commands/import/themeimporter');
const configParser = require('./utils/jamboconfigparser');
const yargs = require('yargs');
const fs = require('file-system');

const jamboConfig = fs.existsSync('config.json') && configParser.computeJamboConfig();

const options = yargs
	.usage('Usage: $0 <cmd> <operation> [options]')
  .command(
    'init',
    'initialize the repository',
    yargs => {
      return yargs
        .option('theme', { description: 'a starter theme' })
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
    },
    argv => {
      const themeImporter = new themeCommand.ThemeImporter(jamboConfig);
      themeImporter.import(argv.theme).then(console.log).catch(console.log);
    })
  .command(
    'override',
    'override a theme or path within a theme',
    yargs => {
      return yargs
        .option('theme', { description: 'theme to override', demandOption: true })
        .option('path', { description: 'path in the theme to override' })
    },
    argv => {
      const shadowConfiguration = new overrideCommand.ShadowConfiguration(argv);
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
        .option('theme', { description: 'theme to use with page' })
        .option('template', { description: 'template to use within theme' });
    },
    argv => {
      const pageConfiguration = new addPageCommand.PageConfiguration(argv);
      const pageScaffolder = new addPageCommand.PageScaffolder(jamboConfig);
      pageScaffolder.create(pageConfiguration).catch(console.log);
    })
	.command(
    'build',
    'build the static pages for the site',
    () => {},
    argv => {
      const sitesGenerator = new buildCommand.SitesGenerator(jamboConfig);
      sitesGenerator.generate();
    })
  .argv;