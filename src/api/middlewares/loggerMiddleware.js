const sequelizeDb = require('../../db/models');
const { LoggerHelpers } = require('../../common/helpers');
const ServiceFactory = require('../../services');

const actionLogService = ServiceFactory.createActionLogService();

function loggerMiddleware(req, res, next) {
  const { models } = sequelizeDb;
  const { userId } = req.user;
  Object.keys(models).forEach((key) => LoggerHelpers.init(userId, actionLogService).run(models[key]));

  next();
}

module.exports = loggerMiddleware;