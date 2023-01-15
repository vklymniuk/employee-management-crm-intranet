const router = require('express').Router();
const { validate } = require('express-validation');
const { TechnologyController } = require('../controllers');
const { CLAIM_TYPES } = require('../../common/consts');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const commonValidator = require('../schemas/common');
const technologyValidator = require('../schemas/technology');
const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.EDIT_TECHNOLOGY,
    CLAIM_TYPES.VIEW_TECHNOLOGY,
    CLAIM_TYPES.VIEW_RESOURCE,
    CLAIM_TYPES.EDIT_RESOURCE,
    CLAIM_TYPES.VIEW_PROJECT,
    CLAIM_TYPES.EDIT_PROJECT,
  ],
});
const editOnly = permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE] });

router.get('/', view, queryOptionsMiddleware, TechnologyController.getTechnologies);
router.get('/:id', view, TechnologyController.getTechnology);
router.post('/', editOnly, validate(technologyValidator.create), TechnologyController.createTechnology,);
router.put('/:id', editOnly, validate(technologyValidator.update), TechnologyController.updateTechnology,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), TechnologyController.deleteTechnology,);

module.exports = router;