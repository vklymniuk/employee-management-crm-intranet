const router = require('express').Router();
const { validate } = require('express-validation');
const { MailingController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const mailingValidator = require('../schemas/mailing');
const commonValidator = require('../schemas/common');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_MAILING],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_MAILING, CLAIM_TYPES.EDIT_MAILING],
});

router.get('/', view, queryOptionsMiddleware, MailingController.getMailings);
router.get('/:id', view, MailingController.getMailing);
router.get('/:id/selectAllVisible', view, queryOptionsMiddleware, MailingController.selectAllVisible);
router.get('/:id/deselectAllVisible', view, queryOptionsMiddleware, MailingController.deselectAllVisible);
router.get('/:id/deselectAll', view, queryOptionsMiddleware, MailingController.deselectAll);
router.get('/:id/received', view, queryOptionsMiddleware, MailingController.received);
router.post('/', editOnly, validate(mailingValidator.create), MailingController.createMailing,);
router.put('/:id', editOnly, validate(mailingValidator.update), MailingController.updateMailing,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), MailingController.deleteMailing,);

module.exports = router;
