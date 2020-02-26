#!/usr/bin/env node

const buildCommand = require('./commands/build/sitesgenerator');
const yargs = require('yargs');

const options = yargs
	.usage('Usage: $0 <cmd> <operation> [options]')
	.command('init', 'initialize the repository')
	.command('theme', 'import or update a theme')
	.command('page', 'add a new page')
	.command(
    'build',
    'build the static pages for the site',
    () => {},
    argv => {
      const sitesGenerator = new buildCommand.SitesGenerator();
      sitesGenerator.generate();
    })
  .argv;