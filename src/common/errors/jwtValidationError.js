const ApiBaseError = require('./apiBaseError');

class JwtValidationError extends ApiBaseError {
  constructor(message) {
    super(message, 'JwtValidationError', 401);
  }
}

module.exports = JwtValidationError;