const ApiBaseError = require('./apiBaseError');

class RoleNotAssignedError extends ApiBaseError {
  constructor(message = 'Role is not assigned for your user. Please contact admin.') {
    super(message, 'RoleNotAssignError', 404);
  }
}

module.exports = RoleNotAssignedError;