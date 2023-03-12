class DbBaseError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name || 'DbBaseError';
  }
}

module.exports = DbBaseError;
