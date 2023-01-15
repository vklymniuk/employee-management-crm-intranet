const router = require('express').Router({ mergeParams: true });
const { validate } = require('express-validation');
const { ResourceContractController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE, CLAIM_TYPES.VIEW_RESOURCE],
});

router.get('/', view, ResourceContractController.getContracts,);
router.post('/', permissionCheckMiddleware({claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO],}), validate(resourceValidator.createContract), ResourceContractController.createContract,);
router.patch('/:contractId', editOnly, validate(resourceValidator.updateContract), ResourceContractController.updateContract,);
router.delete('/:contractId', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTRACT_INFO], }), validate(resourceValidator.removeContract), ResourceContractController.deleteContract,);

module.exports = router;