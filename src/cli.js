#!/usr/bin/env node

const fs = require('file-system');
const path = require('path');

const { parseJamboConfig } = require('./utils/jamboconfigutils');
const { exitWithError } = require('./utils/errorutils');
const CommandRegistry = require('./commands/commandregistry');
const YargsFactory = require('./yargsfactory');
const CommandImporter = require('./commands/commandimporter');

let jamboConfig;

try {
  jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();
} catch (e) {
  exitWithError(e);
}

const commandRegistry = new CommandRegistry();
const commandImporter = new CommandImporter(
  path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme), jamboConfig.dirs.output);
commandImporter.import().forEach(customCommand => {
  commandRegistry.addCommand(customCommand)
});

const yargsFactory = new YargsFactory(commandRegistry);
const options = yargsFactory.createCLI(jamboConfig);
options.argv;
