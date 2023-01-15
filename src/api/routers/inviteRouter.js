const router = require('express').Router();
const { validate } = require('express-validation');
const { InviteController } = require('../controllers');
const { CLAIM_TYPES } = require('../../common/consts');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const commonValidator = require('../schemas/common');
const inviteValidator = require('../schemas/invite');
const permission = permissionCheckMiddleware({ claims: [CLAIM_TYPES.INVITE_USER] });

router.post('/inviteUser', permission, validate(inviteValidator.invite), InviteController.inviteUser,);
router.get('/invite/pending', permission, queryOptionsMiddleware, InviteController.getPendingInvites,);
router.delete('/invite/:id', permission, validate(commonValidator.deleteReq), InviteController.deletePendingInvite,);

module.exports = router;