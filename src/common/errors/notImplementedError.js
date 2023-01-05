const InternalServerError = require('./internalServerError');

class NotImplementedError extends InternalServerError {
    constructor(message = 'This functionality still in development') {
        super(message);
    }
}

module.exports = NotImplementedError;