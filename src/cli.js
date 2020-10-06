#!/usr/bin/env node

const fs = require('file-system');

const { parseJamboConfig } = require('./utils/jamboconfigutils');
const { exitWithError } = require('./utils/errorutils');
const CommandRegistry = require('./commands/commandregistry');
const YargsFactory = require('./yargsfactory');

let jamboConfig;

try {
  jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();
} catch (e) {
  exitWithError(e);
}

const commandRegistry = new CommandRegistry();
const yargsFactory = new YargsFactory(commandRegistry);
const options = yargsFactory.createCLI(jamboConfig);
options.argv;
