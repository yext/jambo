#!/usr/bin/env node
const { exitWithError } = require('./utils/errorutils');
const buildJamboCLI = require('./buildJamboCLI');

const jambo = buildJamboCLI(process.argv);
jambo && jambo.parseAsync().catch(err => {
  // Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
  exitWithError(err);
});
