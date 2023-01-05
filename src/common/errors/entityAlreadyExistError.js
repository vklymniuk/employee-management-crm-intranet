const ApiBaseError = require('./apiBaseError');

class EntityAlreadyExistError extends ApiBaseError {
  constructor(message = 'Entity already exist') {
    super(message, 'EntityAlreadyExistError', 400);
  }
}

module.exports = EntityAlreadyExistError;