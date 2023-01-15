const router = require('express').Router();
const { validate } = require('express-validation');
const { VacationSettingsController } = require('../controllers');
const vacationValidator = require('../schemas/vacation');
const commonValidator = require('../schemas/common');
const { CLAIM_TYPES } = require('../../common/consts');
const { permissionCheckMiddleware } = require('../middlewares');
const editOnly = permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_VACATION_SETTINGS] });
const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_VACATION_SETTINGS, CLAIM_TYPES.EDIT_VACATION_SETTINGS,
  ],
});

router.get('/', view, VacationSettingsController.getAllSettings,);
router.get('/:key', view, validate(commonValidator.keyReq), VacationSettingsController.getSettingsByKey,);
router.put('/u/vacationRecipientEmail', editOnly, validate(vacationValidator.updateVacationRecipientEmail), VacationSettingsController.updateVacationRecipientEmail,);

module.exports = router;