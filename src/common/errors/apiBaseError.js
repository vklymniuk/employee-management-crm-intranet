class ApiBaseError extends Error {
    constructor(message, name, statusCode) {
      super(message);
      this.name = name || 'ApiBaseError';
      this.statusCode = statusCode || 500;
    }
}

module.exports = ApiBaseError;