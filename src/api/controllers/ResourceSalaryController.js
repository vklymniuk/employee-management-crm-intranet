const BaseResourceCRUDController = require('./BaseResourceCRUDController');
const ServiceFactory = require('../../services');

const service = ServiceFactory.createResourceSalaryService();
const baseResourceCRUDController = new BaseResourceCRUDController(service, 'salaryId');

async function getSalaries(req, res, next) {
  await baseResourceCRUDController.getEntities(req, res, next);
}

async function createSalary(req, res, next) {
  await baseResourceCRUDController.createEntity(req, res, next);
}

async function updateSalary(req, res, next) {
  await baseResourceCRUDController.updateEntity(req, res, next);
}

async function deleteSalary(req, res, next) {
  await baseResourceCRUDController.deleteEntity(req, res, next);
}

module.exports = { getSalaries, createSalary, updateSalary, deleteSalary, };