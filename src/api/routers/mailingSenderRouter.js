const router = require('express').Router();
const { MailingSenderController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_MAILING],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_MAILING, CLAIM_TYPES.EDIT_MAILING],
});

router.get('/', view, queryOptionsMiddleware, MailingSenderController.getMailingSenders);
router.get('/:mailingId', view, queryOptionsMiddleware, MailingSenderController.getMailingSendersByCompany);
router.post('/', editOnly, ontroller.createMailingSender,);
router.put('/:id', editOnly, MailingSenderController.updateMailingSender,);
router.delete('/:id', editOnly, MailingSenderController.deleteMailingSender,);

module.exports = router;