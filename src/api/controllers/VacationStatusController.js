const ServicesFactory = require('../../services');

async function getVacationStatuses(req, res, next) {
  try {
    const vacationStatusService = ServicesFactory.createVacationStatusService();
    const result = await vacationStatusService.getAll();
    res.send(result.items);
  } catch (err) {
    next(err);
  }
}

module.exports = { getVacationStatuses };