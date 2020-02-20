let jambo = require('./index')
/*
	jambo
		init
		theme
			import
			update
		page
			add
		build
*/

var argv = require('yargs')
	.usage('Usage: $0 <cmd> <operation> [options]')
	.command('init', 'initialize the repository')
	.command('theme', 'import or update a theme')
	.command('page', 'add a new page')
	.command('build', 'build the answers site')
	.argv

jambo.build();