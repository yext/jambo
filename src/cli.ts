#!/usr/bin/env node
import { exitWithError } from './utils/errorutils';
import buildJamboCLI from './buildJamboCLI';
import { Argv } from 'yargs';

// Exit with a non-zero exit code for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', exitWithError);
process.on('uncaughtException', exitWithError);

const jambo: Argv = buildJamboCLI(process.argv);
jambo && jambo.parseAsync().catch(exitWithError);
