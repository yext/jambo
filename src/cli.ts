#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import Command from './models/commands/command';

// As we cut things over to TS, we will gradually replace these with ES6 imports.
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
if (jamboConfig && jamboConfig.dirs && jamboConfig.dirs.output) {
  const commandImporter = jamboConfig.defaultTheme ?
    new CommandImporter(
      jamboConfig.dirs.output, 
      path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme)) :
    new CommandImporter(jamboConfig.dirs.output);
  
  commandImporter.import().forEach((customCommand: Command) => {
    commandRegistry.addCommand(customCommand)
  });
}

const yargsFactory = new YargsFactory(commandRegistry);
const options = yargsFactory.createCLI(jamboConfig);
options.argv;
