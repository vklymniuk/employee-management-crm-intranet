const { PermissionDeniedError } = require('../../common/errors');

module.exports = (options) => (req, res, next) => {
  const isAllowed = options.claims.some((claim) => req.user.claims.indexOf(claim) >= 0);

  if (isAllowed) {
    next();
  } else {
    const error = new PermissionDeniedError();
    next(error);
  }

};