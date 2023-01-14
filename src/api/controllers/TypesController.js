const ServicesFactory = require('../../services');

async function getAssignmentTypes(req, res, next) {
  try {

    const { userId } = req.user;
    const assignmentTypeService = ServicesFactory.createAssignmentTypeService(userId);
    const result = await assignmentTypeService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getProjectStatuses(req, res, next) {
  try {

    const { userId } = req.user;
    const projectStatusService = ServicesFactory.createProjectStatusService(userId);
    const result = await projectStatusService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getBonusTypes(req, res, next) {
  try {

    const { userId } = req.user;
    const bonusTypeService = ServicesFactory.createBonusTypeService(userId);
    const result = await bonusTypeService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getFlagTypes(req, res, next) {
  try {

    const { userId } = req.user;
    const flagTypeService = ServicesFactory.createFlagTypeService(userId);
    const result = await flagTypeService.getAll();
    res.send(result.items);
    
  } catch (err) {
    next(err);
  }
}

async function getTechnologyTypes(req, res, next) {
  try {

    const { userId } = req.user;
    const techonlogyTypeService = ServicesFactory.createTechnologyTypeService(userId);
    const result = await techonlogyTypeService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getTiers(req, res, next) {
  try {

    const { userId } = req.user;
    const tierService = ServicesFactory.createTierService(userId);
    const result = await tierService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getWorkloads(req, res, next) {
  try {

    const service = ServicesFactory.createWorkloadService();
    const result = await service.getWorkloadTypes();
    return res.send(result.items);

  } catch (err) {
    next(err);
  }
}

module.exports = { getTechnologyTypes, getFlagTypes, getBonusTypes, getProjectStatuses, getAssignmentTypes, getTiers, getWorkloads, };