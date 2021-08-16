import UserError from '../errors/usererror';
import SystemError from '../errors/systemerror';
import { error } from './logger';

/**
 * Print the error, and then forcefully end the 
 * process with the specified exit code. Pending
 * async operations will be lost.
 * @param {Error} error
 */
export const exitWithError = (err = {}) => {
  err.stack && error(err.stack);
  const exitCode = err.exitCode || 1;
  process.exit(exitCode);
};

/**
 * Returns true if the error is a custom error
 * (Either UserError or SystemError)
 * @param {Error} err The error to evaluate
 */
export const isCustomError = (err) => {
  return (err instanceof UserError || err instanceof SystemError);
};