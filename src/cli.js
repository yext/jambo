#!/usr/bin/env node

const fs = require('file-system');
const path = require('path');

const { parseJamboConfig } = require('./utils/jamboconfigutils');
const { exitWithError } = require('./utils/errorutils');
const CommandRegistry = require('./commands/commandregistry');
const YargsFactory = require('./yargsfactory');
const CommandImporter = require('./commands/commandimporter');

// Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', err => {
  exitWithError(err);
});
process.on('uncaughtException', err => {
  exitWithError(err);
});

const jamboConfig = fs.existsSync('jambo.json') && parseJamboConfig();

const commandRegistry = new CommandRegistry(jamboConfig);
if (jamboConfig && jamboConfig.dirs && jamboConfig.dirs.output) {
  const commandImporter = jamboConfig.defaultTheme ?
    new CommandImporter(
      jamboConfig.dirs.output,
      path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme)) :
    new CommandImporter(jamboConfig.dirs.output);

  commandImporter.import().forEach(customCommand => {
    commandRegistry.addCommand(customCommand)
  });
}

const yargsFactory = new YargsFactory(commandRegistry, jamboConfig);
const options = yargsFactory.createCLI();
options.argv;
