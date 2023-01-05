const ApiBaseError = require('./apiBaseError');

class InternalServerError extends ApiBaseError {
  constructor(message) {
    super(message, 'InternalServerError', 500);
  }
}

module.exports = InternalServerError;