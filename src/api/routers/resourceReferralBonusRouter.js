const router = require('express').Router({ mergeParams: true });
const { validate } = require('express-validation');
const { ResourceReferralBonusController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE, CLAIM_TYPES.VIEW_RESOURCE],
});

router.get('/', view, ResourceReferralBonusController.getBonuses,);
router.post('/', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.createReferralBonus), ResourceReferralBonusController.createBonus,);
router.patch('/:referralId', editOnly, validate(resourceValidator.updateReferralBonus), ResourceReferralBonusController.updateBonus,);
router.delete('/:referralId', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.removeReferralBonus), ResourceReferralBonusController.deleteBonus,);

module.exports = router;