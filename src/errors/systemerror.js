/**
 * Represents errors related to the system which are
 * not likely to be caused by users of jambo
 */
class SystemError extends Error {  
  constructor (message, stack) {
    super(message);

    if(stack){
      this.stack = stack;
    }else{
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'SystemError'
    this.exitCode = 14;
  }
}

module.exports = SystemError;