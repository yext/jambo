/**
 * Represents errors that we shouldn't make assumptions on whose fault it is.
 */
 class UnknownError extends Error {
  constructor(message, stack) {
    super(message);

    this.name = 'UnknownError'
    this.exitCode = 15;

    if (stack) {
      this.message = `${this.name}: ${message}`;
      this.stack = `${this.message}\n${stack}`;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = UnknownError;