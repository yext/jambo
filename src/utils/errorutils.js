const fs = require('fs');

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