#!/usr/bin/env node
const { exitWithError } = require('./utils/errorutils');
const buildJamboCLI = require('./buildJamboCLI');

// Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', err => {
  exitWithError(err);
});
process.on('uncaughtException', err => {
  exitWithError(err);
});

const jambo = buildJamboCLI(process.argv)
  .fail(function(msg, err, yargs) {
    if (err) throw err // preserve stack
    console.error('You broke it!')
    console.error(msg)
    console.error('You should be doing', yargs.help())
    process.exit(1)
  })
jambo && jambo.parse();
