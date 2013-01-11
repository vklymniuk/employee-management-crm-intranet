const BaseResourceCRUDController = require('./BaseResourceCRUDController');
const ServiceFactory = require('../../services');

const service = ServiceFactory.createResourceCommentService();
const baseResourceCRUDController = new BaseResourceCRUDController(service, 'commentId');

async function getComments(req, res, next) {
  await baseResourceCRUDController.getEntities(req, res, next);
}

async function createComment(req, res, next) {
  await baseResourceCRUDController.createEntity(req, res, next);
}

async function updateComment(req, res, next) {
  await baseResourceCRUDController.updateEntity(req, res, next);
}

async function deleteComment(req, res, next) {
  await baseResourceCRUDController.deleteEntity(req, res, next);
}

module.exports = { getComments, createComment, updateComment, deleteComment,};