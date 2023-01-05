const ApiBaseError = require('./apiBaseError');

class PermissionDeniedError extends ApiBaseError {
  constructor(message = 'Permission denied') {
    super(message, 'PermissionDeniedError', 403);
  }
}

module.exports = PermissionDeniedError;