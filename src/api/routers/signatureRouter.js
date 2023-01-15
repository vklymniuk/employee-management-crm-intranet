const router = require('express').Router();
const { validate } = require('express-validation');
const { SignatureController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const signatureValidator = require('../schemas/signature');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_AUTH_CREDENTIAL],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_AUTH_CREDENTIAL, CLAIM_TYPES.EDIT_AUTH_CREDENTIAL],
});

router.get('/', view, queryOptionsMiddleware, SignatureController.getSignatures);
router.get('/:id', view, SignatureController.getSignature);
router.post('/', editOnly, validate(signatureValidator.create), SignatureController.createSignature,);
router.put('/:id', editOnly, validate(signatureValidator.update), SignatureController.updateSignature,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), SignatureController.deleteSignature,);

module.exports = router;