const router = require('express').Router();
const { CronController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_ROLE, CLAIM_TYPES.EDIT_ROLE, CLAIM_TYPES.INVITE_USER, CLAIM_TYPES.EDIT_USER,
  ],
});

router.get('/contract', view, CronController.contract);
router.get('/birthday', view, CronController.birthday);
router.get('/marketing', view, CronController.marketing);
router.get('/redisCache', view, CronController.redisCache);

module.exports = router;