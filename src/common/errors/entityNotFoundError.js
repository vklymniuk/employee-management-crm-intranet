const ApiBaseError = require('./apiBaseError');

class EntityNotFoundError extends ApiBaseError {
  constructor(entityType, key, value) {
    const errorMessage = `${entityType} with ${key} ${value} not found`;
    super(errorMessage, 'EntityNotFoundError', 404);
  }
}

module.exports = EntityNotFoundError;