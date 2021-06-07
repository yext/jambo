#!/usr/bin/env node
const { exitWithError } = require('./utils/errorutils');
const buildJamboCLI = require('./buildJamboCLI');

// Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', exitWithError);
process.on('uncaughtException', exitWithError);

const jambo = buildJamboCLI(process.argv);
jambo && jambo.parseAsync().catch(exitWithError);
