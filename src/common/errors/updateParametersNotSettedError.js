const ApiBaseError = require('./apiBaseError');

class UpdateParametersNotSettedError extends ApiBaseError {
  constructor(messsage = 'Update parameters not setted') {
    super(messsage, 'UpdateParametersNotSettedError', 400);
  }
}

module.exports = UpdateParametersNotSettedError;