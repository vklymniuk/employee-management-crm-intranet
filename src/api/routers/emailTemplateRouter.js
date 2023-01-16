const router = require('express').Router();
const { validate } = require('express-validation');
const { EmailTemplateController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const emailTemplateValidator = require('../schemas/emailTemplate');
const commonValidator = require('../schemas/common');
const { EmailAssetsUpload } = require('../expressConfigs/multerConfig');

const upload = EmailAssetsUpload();

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_EMAIL_TEMPLATE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_EMAIL_TEMPLATE, CLAIM_TYPES.EDIT_EMAIL_TEMPLATE],
});

router.get('/', view, queryOptionsMiddleware, EmailTemplateController.getEmailTemplates);
router.get('/:id', view, EmailTemplateController.getEmailTemplate);
router.post('/', editOnly, /* validate(emailTemplateValidator.create), */ EmailTemplateController.createEmailTemplate,);
router.put('/:id', editOnly, validate(emailTemplateValidator.update), EmailTemplateController.updateEmailTemplate,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), EmailTemplateController.deleteEmailTemplate,);
router.post('/assetsUpload/:id', upload.single('asset'), EmailTemplateController.uploadEmailTemplateAsset,);

module.exports = router;