const router = require('express').Router();
const { validate } = require('express-validation');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const { RoleController } = require('../controllers');
const commonValidator = require('../schemas/common');
const roleValidator = require('../schemas/role');

const editOnly = permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_ROLE] });
const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_ROLE, CLAIM_TYPES.EDIT_ROLE, CLAIM_TYPES.INVITE_USER, CLAIM_TYPES.EDIT_USER,
  ],
});

router.get('/', view, RoleController.getRoles);
router.get('/claims', view, RoleController.getRolesWithClaims);
router.post('/', editOnly, validate(roleValidator.create), RoleController.createRole,);
router.patch('/:id/addClaim', editOnly, validate(roleValidator.changeClaim), RoleController.addClaimToRole,);
router.patch('/:id/removeClaim', editOnly, validate(roleValidator.changeClaim), RoleController.removeClaimFromRole,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), RoleController.deleteRole,);
router.put('/:id', editOnly, validate(roleValidator.update), RoleController.updateRole,);

module.exports = router;