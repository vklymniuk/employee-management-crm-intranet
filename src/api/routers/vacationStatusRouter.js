const router = require('express').Router();
const { VacationStatusController } = require('../controllers');

router.get('/', VacationStatusController.getVacationStatuses);

module.exports = router;