const router = require('express').Router();
const { validate } = require('express-validation');
const { CampaignController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const campaignValidator = require('../schemas/campaign');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_CAMPAIGN],
});

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_CAMPAIGN,
    CLAIM_TYPES.EDIT_CAMPAIGN,
    CLAIM_TYPES.VIEW_MAILING,
    CLAIM_TYPES.EDIT_MAILING,
    CLAIM_TYPES.VIEW_RECIPIENT,
    CLAIM_TYPES.EDIT_RECIPIENT,
  ],
});

router.get('/', view, CampaignController.getCampaigns);
router.post('/', editOnly, validate(campaignValidator.create), CampaignController.createCampaign,);
router.put('/:id', editOnly, validate(campaignValidator.update), CampaignController.updateCampaign,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), CampaignController.deleteCampaign,);

module.exports = router;