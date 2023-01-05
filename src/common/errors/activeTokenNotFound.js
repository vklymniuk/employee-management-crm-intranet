const ApiBaseError = require('./apiBaseError');

class ActiveTokenNotFoundError extends ApiBaseError {
  constructor(message = 'There is no active token found') {
    super(message, 'ActiveTokenNotFoundError', 404);
  }
}

module.exports = ActiveTokenNotFoundError;