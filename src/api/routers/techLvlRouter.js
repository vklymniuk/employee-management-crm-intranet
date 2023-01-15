const router = require('express').Router();
const { validate } = require('express-validation');
const { TechLvlController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const techLvlValidator = require('../schemas/techLvl');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_LEVELS],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_RESOURCE, CLAIM_TYPES.VIEW_LEVELS, CLAIM_TYPES.EDIT_LEVELS],
});

router.get('/', view, TechLvlController.getTechLvls);
router.post('/', editOnly, validate(techLvlValidator.create), TechLvlController.createTechLvl,);
router.put('/:id', editOnly, validate(techLvlValidator.update), TechLvlController.updateTechLvl,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), TechLvlController.deleteTechLvl,);

module.exports = router;