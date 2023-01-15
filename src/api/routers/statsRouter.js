const router = require('express').Router();
const { StatsController } = require('../controllers');

router.get('/resource', StatsController.getResourceStats);
router.get('/project', StatsController.getProjectStats);
router.get('/flag', StatsController.getProjectFlags);
router.get('/closedProjects', StatsController.getClosedProjectsStats);

module.exports = router;