/**
 * Represents errors related to the system which are
 * not likely to be caused by users of jambo
 */
class SystemError extends Error {
  constructor(message, stack) {
    super(message);

    this.name = 'SystemError'
    this.exitCode = 14;

    if (stack) {
      this.message = `${this.name}: ${message}`;
      this.stack = `${this.message}\n${stack}`;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = SystemError;