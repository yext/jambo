#!/usr/bin/env node

const buildCommand = require('./commands/build/sitesgenerator');
const addPageCommand = require('./commands/page/add/pagescaffolder');
const configParser = require('./utils/jamboconfigparser');
const yargs = require('yargs');

const jamboConfig = configParser.computeJamboConfig();

const options = yargs
	.usage('Usage: $0 <cmd> <operation> [options]')
	.command('init', 'initialize the repository')
	.command('theme', 'import or update a theme')
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