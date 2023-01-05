const ApiBaseError = require('./apiBaseError');

class EntityDeletionError extends ApiBaseError {
  constructor(message) {
    super(message, 'EntityDeletionError', 400);
  }
}

module.exports = EntityDeletionError;