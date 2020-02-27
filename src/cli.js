#!/usr/bin/env node

const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const overrideCommand = require('./commands/override/themeshadower');
const configParser = require('./utils/jamboconfigparser');
const yargs = require('yargs');

const jamboConfig = configParser.computeJamboConfig();

const options = yargs
	.usage('Usage: $0 <cmd> <operation> [options]')
	.command('init', 'initialize the repository')
  .command('theme', 'import or update a theme')
  .command(
    'override',
    'override a theme, template, or component',
    yargs => {
      return yargs
        .option('theme', { description: 'theme to override', demandOption: true })
        .option('template', { description: 'template to override' })
        .option('component', { description: 'component to override' })
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
      pageScaffolder.create(pageConfiguration);
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