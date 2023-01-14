const ServicesFactory = require('../../services');
const { getVacationsResponse } = require('../viewModels/vacationResponse');
const { PermissionDeniedError } = require('../../common/errors');
const { VACATION_STATUSES, CLAIM_TYPES } = require('../../common/consts');

async function createVacation(req, res, next) {
  try {
    const vacationService = ServicesFactory.createVacationService();
    const vacation = req.body;

    if (vacation && +vacation.statusId === VACATION_STATUSES.APPROVED) {
        
      if (!req.user.claims.includes(CLAIM_TYPES.APPROVE_VACATION)) {
        const error = new PermissionDeniedError();
        next(error);
      } else {
        const result = await vacationService.createVacation(vacation);
        res.send(result);
      }
    } else {
      const result = await vacationService.createVacation(vacation);
      res.send(result);
    }
    
  } catch (err) {
    next(err);
  }
}

async function getVacations(req, res, next) {
  try {

    const vacationService = ServicesFactory.createVacationService();
    // const userService = ServicesFactory.createUserService();

    /* Always show all vacations */
    req.queryOptions.pagination.limit = 0;
    const vacations = await vacationService.getVacations(req.queryOptions);

    // const user = await userService.getUserById(req.user.id);
    res.send(await getVacationsResponse(vacations.items, true));

  } catch (err) {
    next(err);
  }
}

async function getVacation(req, res, next) {
  try {

    const vacationService = ServicesFactory.createVacationService();
    const result = await vacationService.getVacationDetails(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function calculateVacationDays(req, res, next) {
  try {

    const vacationService = ServicesFactory.createVacationService();
    const { start, end, resourceId } = req.query;
    const result = await vacationService.calculateVacationDays({ start, end, resourceId });
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateVacation(req, res, next) {
  try {

    const vacationService = ServicesFactory.createVacationService();
    const { id } = req.params;
    const vacation = req.body;

    if (vacation.statusId && +vacation.statusId === VACATION_STATUSES.APPROVED) {

      if (!req.user.claims.includes(CLAIM_TYPES.APPROVE_VACATION)) {
        const error = new PermissionDeniedError();
        next(error);
      } else {
        const result = await vacationService.updateVacation(id, vacation);
        res.send(result);
      }
    } else {
      const result = await vacationService.updateVacation(id, vacation);
      res.send(result);
    }

  } catch (err) {
    next(err);
  }
}

async function deleteVacation(req, res, next) {
  try {

    const vacationService = ServicesFactory.createVacationService();
    const { id } = req.params;
    const result = await vacationService.deleteVacation(id);
    res.status(204).send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { createVacation, updateVacation, deleteVacation, getVacations, getVacation, calculateVacationDays, };