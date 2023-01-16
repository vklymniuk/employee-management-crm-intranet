const { processResult } = require('../viewModels/resourceResponse');

function resourceBlockMiddleware(req, res, next) {
  req.body = processResult(req.body, req.user.claims, true);
  next();

}

module.exports = resourceBlockMiddleware;