const router = require('express').Router();
const { LocationController } = require('../controllers');

router.get('/', LocationController.getLocations);

module.exports = router;