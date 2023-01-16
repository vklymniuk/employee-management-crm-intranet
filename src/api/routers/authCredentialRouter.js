const router = require('express').Router();
const { validate } = require('express-validation');
const { AuthCredentialController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const authCredentialValidator = require('../schemas/authCredential');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_AUTH_CREDENTIAL],
});

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_AUTH_CREDENTIAL,
    CLAIM_TYPES.EDIT_AUTH_CREDENTIAL,
    CLAIM_TYPES.VIEW_MAILING,
    CLAIM_TYPES.EDIT_MAILING,
  ],
});

router.get('/', view, queryOptionsMiddleware, AuthCredentialController.getAuthCredentials);
router.get('/:id', view, AuthCredentialController.getAuthCredential);
router.post('/', editOnly, validate(authCredentialValidator.create), AuthCredentialController.createAuthCredential,);
router.put('/:id', editOnly, validate(authCredentialValidator.update), AuthCredentialController.updateAuthCredential,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), AuthCredentialController.deleteAuthCredential,);

module.exports = router;