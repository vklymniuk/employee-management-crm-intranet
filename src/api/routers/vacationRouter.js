const router = require('express').Router();
const { validate } = require('express-validation');
const { VacationController, VacationSettingsController } = require('../controllers');
const commonValidator = require('../schemas/common');
const vacationValidator = require('../schemas/vacation');
const { CLAIM_TYPES } = require('../../common/consts');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');

/* To check if a user has the required permissions */
const permission = (claim) => permissionCheckMiddleware({ claims: claim });

router.get('/', permission([CLAIM_TYPES.VIEW_VACATION_PAGE]), queryOptionsMiddleware, VacationController.getVacations,);
router.get('/:id', permission([CLAIM_TYPES.VIEW_VACATION_PAGE]), VacationController.getVacation,);
router.get('/u/calculateVacationDays', permission([CLAIM_TYPES.VIEW_VACATION_PAGE]), VacationController.calculateVacationDays,);
router.post('/', permission([CLAIM_TYPES.CREATE_VACATION]), validate(vacationValidator.create), VacationController.createVacation,);
router.put('/:id', validate(vacationValidator.update), permission([CLAIM_TYPES.UPDATE_VACATION]), VacationController.updateVacation,);
router.delete('/:id', validate(commonValidator.deleteReq), permission([CLAIM_TYPES.DELETE_VACATION]), VacationController.deleteVacation,);

module.exports = router;