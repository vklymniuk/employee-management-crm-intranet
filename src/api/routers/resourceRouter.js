const router = require('express').Router();
const { validate } = require('express-validation');
const {
  ResourceController,
} = require('../controllers');
const ResourceRoleRouter = require('./resourceRoleRouter');
const ResourceSalaryRouter = require('./resourceSalaryRouter');
const ResourceContractRouter = require('./resourceContractRouter');
const ResourceSigningBonusRouter = require('./resourceSigningBonusRouter');
const ResourceReferralBonusRouter = require('./resourceReferralBonusRouter');
const ResourceCommentRouter = require('./resourceCommentRouter');
const { ResourceUpload } = require('../expressConfigs/multerConfig');
const {
  permissionCheckMiddleware,
  queryOptionsMiddleware,
  resourceBlockMiddleware,
} = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const resourceValidator = require('../schemas/resource');
const commonValidator = require('../schemas/common');

const upload = ResourceUpload();

const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_RESOURCE],
});

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.EDIT_RESOURCE,
    CLAIM_TYPES.VIEW_RESOURCE,
    CLAIM_TYPES.VIEW_PROJECT,
    CLAIM_TYPES.EDIT_PROJECT,
  ],
});

router.use('/roles', ResourceRoleRouter);
router.use('/:id/contract', ResourceContractRouter);
router.use('/:id/salary', ResourceSalaryRouter);
router.use('/:id/signingBonus', ResourceSigningBonusRouter);
router.use('/:id/referralBonus', ResourceReferralBonusRouter);
router.use('/:id/comment', ResourceCommentRouter);
router.get('/', view, queryOptionsMiddleware, ResourceController.getResources);
router.post('/export/xls', view, queryOptionsMiddleware, ResourceController.exportExcel);
router.get('/:id', view, ResourceController.getResource);
router.get('/:id/vacationDaysLeft', view, ResourceController.getVacationDaysLeft);
router.post('/', editOnly, validate(resourceValidator.create), ResourceController.createResource,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), ResourceController.deleteResource,);
router.put('/:id', editOnly, upload.single('avatar'), validate(resourceValidator.update), resourceBlockMiddleware, ResourceController.updateResource,);
router.patch('/:id/addTechnology', editOnly, validate(resourceValidator.changeTechnology), ResourceController.addTechnology,);
router.patch('/:id/updateTechnologies', permissionCheckMiddleware({ claims: [CLAIM_TYPES.EDIT_RESOURCE_MAIN_INFO], }), validate(resourceValidator.updateTechnologiesList), ResourceController.updateTechnologies, );
router.patch('/:id/removeTechnology', editOnly, validate(resourceValidator.changeTechnology), ResourceController.removeTechnology,);
router.patch('/:id/addProject', editOnly, validate(resourceValidator.changeProject), ResourceController.addProject,);
router.patch('/:id/removeProject', editOnly, validate(resourceValidator.changeProject), ResourceController.removeProject,);
router.patch('/:id/updateProject', editOnly, validate(resourceValidator.updateProject), ResourceController.updateProject,);
router.patch('/:id/updateAssignType', editOnly, validate(resourceValidator.updateAssignmentType), ResourceController.updateAssignmentType,);
router.get('/u/timeline', view, queryOptionsMiddleware, ResourceController.getResourcesByTimeline,);

router.patch(
  '/:id/updateProjects',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_MAIN_INFO],
  }),
  validate(resourceValidator.updateProjects),
  ResourceController.updateProjects,
);

router.patch(
  '/:id/hireInfo',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_STATUS_INFO],
  }),
  validate(resourceValidator.updateHireBlock),
  ResourceController.updateResource,
);

router.patch(
  '/:id/contactInfo',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_CONTACT_INFO],
  }),
  validate(resourceValidator.updateContactBlock),
  ResourceController.updateResource,
);

router.patch(
  '/:id/vacationInfo',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_VACATION_INFO],
  }),
  validate(resourceValidator.updateVacationInfo),
  ResourceController.updateResource,
);

router.patch(
  '/:id/otherInfo',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_OTHER_INFO],
  }),
  validate(resourceValidator.updateOtherInfo),
  ResourceController.updateResource,
);

router.patch('/:id/mainInfo',
  permissionCheckMiddleware({
    claims: [CLAIM_TYPES.EDIT_RESOURCE_MAIN_INFO],
  }), upload.single('avatar'), validate(resourceValidator.updateMainInfo), ResourceController.updateResource,
);

module.exports = router;