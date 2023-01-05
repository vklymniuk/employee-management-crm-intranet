const ApiBaseError = require('./apiBaseError');

class FileNotFoundError extends ApiBaseError {
  constructor(message = 'File not found') {
    super(message, 'FileNotFoundError', 404);
  }
}

module.exports = FileNotFoundError;