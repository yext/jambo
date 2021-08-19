import log from 'npmlog';

log.heading = 'jambo';
log.headingStyle = { fg: 'magenta' };

// Don't display a log prefix.
const PREFIX = '';

/**
 * Sets the global logging level.
 */
export const setLogLevel = function(level) {
  log.level = level;
};

/**
 * Logs an error.
 *
 * @param  {...any} args 
 */
export const error = function(...args: any[]) {
  log.error(PREFIX, ...args)
};

/**
 * Logs a warning.
 *
 * @param  {...any} args 
 */
export const warn = function(...args: any[]) {
  log.warn(PREFIX, ...args)
};

/**
 * Logs info.
 *
 * @param  {...any} args 
 */
export const info = function(...args: any[]) {
  log.info(PREFIX, ...args)
};
