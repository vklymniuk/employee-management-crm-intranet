const router = require('express').Router();
const { validate } = require('express-validation');
const { RecipientController } = require('../controllers');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const { ExcelImportUpload } = require('../expressConfigs/multerConfig');
const { CLAIM_TYPES } = require('../../common/consts');
const recipientValidator = require('../schemas/recipient');
const commonValidator = require('../schemas/common');
const upload = ExcelImportUpload();

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RECIPIENT],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_RECIPIENT, CLAIM_TYPES.EDIT_RECIPIENT],
});

router.get('/', view, queryOptionsMiddleware, RecipientController.getRecipients);
router.post('/import', upload.single('data'), RecipientController.importExcel,);
router.get('/states', view, RecipientController.getStates);
router.get('/cities', view, RecipientController.getCities);
router.post('/', editOnly, validate(recipientValidator.create), RecipientController.createRecipient,);
router.delete('/', editOnly, validate(recipientValidator.bulkDelete), RecipientController.bulkDeleteRecipients,);
router.put('/:id', editOnly, validate(recipientValidator.update), RecipientController.updateRecipient,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), RecipientController.deleteRecipient,);
router.patch('/bulkRemoveFromGroups', editOnly, validate(recipientValidator.bulkAddDeleteFromGroups), RecipientController.bulkDeleteRecipientsFromGroups,);
router.patch('/bulkAddToGroups', editOnly, validate(recipientValidator.bulkAddDeleteFromGroups), RecipientController.bulkAddRecipientsToGroups,);

module.exports = router;