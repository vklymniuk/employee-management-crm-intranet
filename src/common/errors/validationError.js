const ApiBaseError = require('./apiBaseError');

class ValidationError extends ApiBaseError {
  constructor(message) {
    super(message, 'ValidationError', 400);
  }
}

module.exports = ValidationError;