const ApiBaseError = require('./apiBaseError');

class IncorrentPasswordError extends ApiBaseError {
  constructor(message = 'Incorrect password') {
    super(message, 'IncorrectPasswordError', 400);
  }
}

module.exports = IncorrentPasswordError;