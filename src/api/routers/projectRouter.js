const router = require('express').Router();
const { validate } = require('express-validation');
const { ProjectUpload } = require('../expressConfigs/multerConfig');
const { ProjectController } = require('../controllers');
const {
  permissionCheckMiddleware,
  queryOptionsMiddleware,
} = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const commonValidator = require('../schemas/common');
const projectValidator = require('../schemas/project');

const upload = ProjectUpload();

const editOnly = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.EDIT_PROJECT,
    CLAIM_TYPES.EDIT_ONGOING_PROJECT,
    CLAIM_TYPES.EDIT_TIMELINE_PROJECT,
  ],
});

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.EDIT_PROJECT,
    CLAIM_TYPES.VIEW_PROJECT,
    CLAIM_TYPES.VIEW_RESOURCE,
    CLAIM_TYPES.VIEW_ONGOING_PROJECT,
    CLAIM_TYPES.EDIT_ONGOING_PROJECT,
    CLAIM_TYPES.VIEW_TIMELINE_PROJECT,
    CLAIM_TYPES.EDIT_TIMELINE_PROJECT,
  ],
});

router.get('/', view, queryOptionsMiddleware, ProjectController.getProjects);
router.post('/export/xls', view, queryOptionsMiddleware, ProjectController.exportExcel);
router.get('/:id', view, ProjectController.getProject);
router.get('/:id/resourceHistory', view, ProjectController.getResourceHistory);
router.post('/', editOnly, validate(projectValidator.create), ProjectController.createProject,);
router.put('/:id', upload.single('avatar'), editOnly, validate(projectValidator.update), ProjectController.updateProject,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), ProjectController.deleteProject,);
router.patch('/:id/addResource', editOnly, validate(projectValidator.addResource), ProjectController.addResource,);
router.patch('/:id/removeResource', editOnly, validate(projectValidator.removeResource), ProjectController.removeResource,);
router.patch('/:id/updateResource', editOnly, validate(projectValidator.updateResource), ProjectController.updateResource,);
router.patch('/:id/addTechnology', editOnly, validate(projectValidator.addTechnology), ProjectController.addTechnology,);
router.patch('/:id/removeTechnology', editOnly, validate(projectValidator.removeTechnology), ProjectController.removeTechnology,);
router.patch('/:id/updateTechnology', editOnly, validate(projectValidator.updateTechnology), ProjectController.updateTechnology,);
router.patch('/moveResource', editOnly, validate(projectValidator.moveResource), ProjectController.moveResource,);
router.patch('/:id/startProject', editOnly, validate(projectValidator.startProject), ProjectController.startProject,);
router.patch('/:id/updateWorkload', editOnly, validate(projectValidator.updateWorkload), ProjectController.updateWorkload,);

module.exports = router;