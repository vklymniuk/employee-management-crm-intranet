const router = require('express').Router({ mergeParams: true });
const { validate } = require('express-validation');
const { ResourceSalaryController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE, CLAIM_TYPES.VIEW_RESOURCE],
});

router.get('/', view, ResourceSalaryController.getSalaries,);
router.post('/', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.createSalary), ResourceSalaryController.createSalary,);
router.patch('/:salaryId', editOnly, validate(resourceValidator.updateSalary), ResourceSalaryController.updateSalary,);
router.delete('/:salaryId', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO] }), validate(resourceValidator.removeSalary), ResourceSalaryController.deleteSalary,);

module.exports = router;