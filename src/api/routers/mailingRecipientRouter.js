const router = require('express').Router();
const { MailingRecipientController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_MAILING],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_MAILING, CLAIM_TYPES.EDIT_MAILING],
});

router.get('/', view, queryOptionsMiddleware, MailingRecipientController.getMailingRecipients);
router.post('/', editOnly, MailingRecipientController.createMailingRecipient,);
router.put('/:recipientId/:mailingId', editOnly, MailingRecipientController.updateMailingRecipient,);
router.delete('/:recipientId/:mailingId', editOnly, MailingRecipientController.deleteMailingRecipient,);

module.exports = router;