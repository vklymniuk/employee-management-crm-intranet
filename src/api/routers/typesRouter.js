const router = require('express').Router();
const { TypesController } = require('../controllers');

router.get('/assignment', TypesController.getAssignmentTypes);
router.get('/projectStatus', TypesController.getProjectStatuses);
router.get('/bonus', TypesController.getBonusTypes);
router.get('/flag', TypesController.getFlagTypes);
router.get('/technology', TypesController.getTechnologyTypes);
router.get('/tier', TypesController.getTiers);
router.get('/workload', TypesController.getWorkloads);

module.exports = router;