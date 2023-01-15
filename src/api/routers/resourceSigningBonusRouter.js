const router = require('express').Router({ mergeParams: true });
const { validate } = require('express-validation');
const { ResourceSigningBonusController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE, CLAIM_TYPES.VIEW_RESOURCE],
});

router.get('/', view, ResourceSigningBonusController.getBonuses,);
router.post('/', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.createSigningBonus), ResourceSigningBonusController.createBonus,);
router.patch('/:signingId', editOnly, validate(resourceValidator.updateSigningBonus), ResourceSigningBonusController.updateBonus,);
router.delete('/:signingId', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.removeSigningBonus), ResourceSigningBonusController.deleteBonus,);

module.exports = router;
