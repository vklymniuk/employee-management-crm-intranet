const router = require('express').Router();
const { validate } = require('express-validation');
const { EnglishLvlController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const engLvlValidator = require('../schemas/englishLvl');

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_LEVELS],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_RESOURCE, CLAIM_TYPES.VIEW_LEVELS, CLAIM_TYPES.EDIT_LEVELS],
});

router.get('/', view, EnglishLvlController.getEnglishLvls);
router.post('/', editOnly, validate(engLvlValidator.create), EnglishLvlController.createEnglishLvl,);
router.put('/:id', editOnly, validate(engLvlValidator.update), EnglishLvlController.updateEnglishLvl,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), EnglishLvlController.deleteEnglishLvl,);

module.exports = router;