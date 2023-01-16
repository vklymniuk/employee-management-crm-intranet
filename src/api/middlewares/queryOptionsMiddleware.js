const { QueryHelpers } = require('../../common/helpers');

async function queryOptions(req, res, next) {
  try {
    const filters = QueryHelpers.getFiltersFromQuery(req.query);
    const pagination = QueryHelpers.getPaginationFromQuery(req.query);
    const sorters = QueryHelpers.getSortFromQuery(req.query);
    const groupBy = QueryHelpers.getGroupingFromQuery(req.query);
    req.queryOptions = { filters, pagination, sorters, groupBy, };
    await next();
  } catch (err) {
    await next(err);
  }
}

module.exports = queryOptions;