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
jambo && jambo.parse();
