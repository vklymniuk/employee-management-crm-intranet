const router = require('express').Router({ mergeParams: true });
const { validate } = require('express-validation');
const { ResourceCommentController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE, CLAIM_TYPES.VIEW_RESOURCE],
});

router.get('/', view, ResourceCommentController.getComments,);
router.post('/', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.createComment), ResourceCommentController.createComment,);
router.patch('/:commentId', editOnly, validate(resourceValidator.updateComment), ResourceCommentController.updateComment,);
router.delete('/:commentId', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.removeComment), ResourceCommentController.deleteComment,);

module.exports = router;