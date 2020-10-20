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
      this.stack = stack;
      this.message = `${this.name}: ${message}`;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = SystemError;