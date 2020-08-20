const fs = require('fs');
const UserError = require('../errors/usererror');
const SystemError = require('../errors/systemerror');

/**
 * Print the error, and then forcefully end the 
 * process with the specified exit code. Pending
 * async operations will be lost.
 * @param {Error} error
 */
exports.exitWithError = (err) => {
  fs.writeSync(process.stderr.fd,
    `${err.message}\n` +
    `${err.stack}`
  );
  const exitCode = err.exitCode || 1;
  process.exit(exitCode);
}

/**
 * Returns true if the error is a custom error
 * (Either UserError or SystemError)
 * @param {Error} err The error to evaluate
 */
exports.isCustomError = (err) => {
  return (err instanceof UserError || err instanceof SystemError);
}