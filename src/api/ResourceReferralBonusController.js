const BaseResourceCRUDController = require('./BaseResourceCRUDController');
const ServiceFactory = require('../../services');

const service = ServiceFactory.createResourceReferralBonusService();
const baseResourceCRUDController = new BaseResourceCRUDController(service, 'referralId');

async function getBonuses(req, res, next) {
  await baseResourceCRUDController.getEntities(req, res, next);
}

async function createBonus(req, res, next) {
  await baseResourceCRUDController.createEntity(req, res, next);
}

async function updateBonus(req, res, next) {
  await baseResourceCRUDController.updateEntity(req, res, next);
}

async function deleteBonus(req, res, next) {
  await baseResourceCRUDController.deleteEntity(req, res, next);
}

module.exports = { getBonuses, createBonus, updateBonus, deleteBonus, };