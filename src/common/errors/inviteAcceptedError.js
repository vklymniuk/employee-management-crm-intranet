const ApiBaseError = require('./apiBaseError');

class InvitedAcceptedError extends ApiBaseError {
  constructor(message = 'Invite already accepted') {
    super(message, 'InvitedAcceptedError', 400);
  }
}

module.exports = InvitedAcceptedError;