/**
 * Represents errors that we may reasonably expect a user to make
 */
class UserError extends Error {  
  constructor(message, stack) {
    super(message);

    if (stack) {
      this.stack = stack;
      this.message = message;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'UserError'
    this.exitCode = 13;
  }
}

module.exports = UserError;