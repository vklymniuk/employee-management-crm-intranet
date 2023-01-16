const router = require('express').Router();
const { validate } = require('express-validation');
const { GroupController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const groupValidator = require('../schemas/group');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_GROUPS],
});

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_GROUPS,
    CLAIM_TYPES.EDIT_GROUPS,
    CLAIM_TYPES.VIEW_MAILING,
    CLAIM_TYPES.EDIT_MAILING,
    CLAIM_TYPES.VIEW_RECIPIENT,
    CLAIM_TYPES.EDIT_RECIPIENT,
  ],
});

router.get('/', view, GroupController.getGroups);
router.post('/', editOnly, validate(groupValidator.create), GroupController.createGroup,);
router.put('/:id', editOnly, validate(groupValidator.update), GroupController.updateGroup,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), GroupController.deleteGroup,);

module.exports = router;