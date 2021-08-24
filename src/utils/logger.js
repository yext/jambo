const log = require('npmlog');

log.heading = 'jambo';
log.headingStyle = { fg: 'magenta' };

// Don't display a log prefix.
const PREFIX = '';

/**
 * Sets the global logging level.
 */
exports.setLogLevel = function(level) {
  log.level = level;
}

/**
 * Logs an error.
 *
 * @param  {...any} args 
 */
exports.error = function(...args) {
  log.error(PREFIX, ...args)
}

/**
 * Logs a warning.
 *
 * @param  {...any} args 
 */
exports.warn = function(...args) {
  log.warn(PREFIX, ...args)
}

/**
 * Logs info.
 *
 * @param  {...any} args 
 */
exports.info = function(...args) {
  log.info(PREFIX, ...args)
}
