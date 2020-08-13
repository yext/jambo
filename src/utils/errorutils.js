/**
 * Print the error, and then end the 
 * process with the specified exit code
 * @param {Error} error
 */
exports.exitWithError = (err) => {
  console.error(err.message);
  console.error(err.stack);
  exitCode = err.exitCode || 1;
  process.exit(exitCode);
}