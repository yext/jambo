/**
 * Represents errors that we may reasonably expect a user to make
 */
class UserError extends Error {
  constructor(message, stack) {
    super(message);

    this.name = 'UserError'
    this.exitCode = 13;

    if (stack) {
      this.message = `${this.name}: ${message}`;
      this.stack = `${this.message}\n${stack}`;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = UserError;