const ApiBaseError = require('./apiBaseError');

class DuplicateSettingsError extends ApiBaseError {
  constructor(message) {

    if (!message) {
      const errorMessage = 'This settings already exists';
      super(errorMessage, 'DuplicateSettingsError', 400);
    } else {
      super(message, 'DuplicateSettingsError', 400);
    }
  }

}

module.exports = DuplicateSettingsError;