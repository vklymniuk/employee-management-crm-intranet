const router = require('express').Router();
const { ScriptController } = require('../controllers');

router.get('/calendar/events', ScriptController.getCalendarEvent);
router.get('/resource/updateAssignmentType', ScriptController.updateResourceAssignmentType);
router.get('/resource/restore', ScriptController.restoreDeletedResources);

module.exports = router;