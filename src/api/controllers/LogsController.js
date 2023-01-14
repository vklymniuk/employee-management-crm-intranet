const ServicesFactory = require('../../services');
const { ORDER } = require('../../common/consts/common');
const {
  getActionLogsResponse,
  getActionLogResponse,
} = require('../viewModels/actionLogResponse');

async function getLogs(req, res, next) {
  try {

    const logsService = ServicesFactory.createActionLogService();

    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push({
        key: 'createdAt',
        order: ORDER.DESC,
      });
    }

    const result = await logsService.getAll(req.queryOptions);
    result.items = await getActionLogsResponse(result.items);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getLog(req, res, next) {
  try {
    const logsService = ServicesFactory.createActionLogService();

    const result = await logsService.getLog(req.params.id);
    res.send(await getActionLogResponse(result));

  } catch (err) {
    next(err);
  }
}

async function getEntityTypes(req, res, next) {
  try {

    // Get logs from database
    const logsService = ServicesFactory.createActionLogService();

    // Get logs from database
    const result = await logsService.getAll();

    // Set all entityTypes from the received logs for the response
    const entityTypes = Array.from(
      new Set(result.items.map((i) => i.entityType)),
    );

    // Send entityTypes
    res.send(entityTypes);

  } catch (err) {
    next(err);
  }
}

module.exports = { getLogs, getLog, getEntityTypes, };