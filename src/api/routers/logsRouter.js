const router = require('express').Router();
const { permissionCheckMiddleware } = require('../middlewares');
const { queryOptionsMiddleware } = require('../middlewares');
const { ActionLogController } = require('../controllers');
const { CLAIM_TYPES } = require('../../common/consts');

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_ACTION_LOGS],
});

router.get('/', view, queryOptionsMiddleware, ActionLogController.getLogs);
router.get('/:id', view, ActionLogController.getLog);
router.get('/u/entityTypes', view, ActionLogController.getEntityTypes);

module.exports = router;