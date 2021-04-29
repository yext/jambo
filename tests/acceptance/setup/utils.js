const parse = require('shell-quote').parse;
const { spawnSync } = require('child_process');

/**
 * Executes a shell command. Will throw a JS error if
 * the shell command returns an error.
 *
 * @param {string} command 
 */
exports.runCommand = function(command) {
  const [commandName, ...args] = parse(command);
  const { stderr } = spawnSync(commandName, args, {
    encoding: 'utf-8'
  });
  if (stderr) {
    throw new Error(
      `Error executing command "${commandName} ${args.join(' ')}", ${stderr}`);
  }
}
