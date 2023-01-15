const router = require('express').Router();
const { validate } = require('express-validation');
const { ResourceRoleController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceRoleValidator = require('../schemas/resourceRole');
const commonValidator = require('../schemas/common');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE_ROLE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_RESOURCE_ROLE, CLAIM_TYPES.VIEW_RESOURCE, CLAIM_TYPES.EDIT_RESOURCE],
});

router.get('/', view, queryOptionsMiddleware, ResourceRoleController.getResourceRoles);
router.post('/', editOnly, validate(resourceRoleValidator.create), ResourceRoleController.createResourceRole,);
router.put('/:id', editOnly, validate(resourceRoleValidator.update), ResourceRoleController.updateResourceRole,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), ResourceRoleController.deleteResourceRole,);

module.exports = router;