const router = require('express').Router();
const { validate } = require('express-validation');
const { FutureProjectController, ProjectController } = require('../controllers');
const commonValidator = require('../schemas/common');
const projectValidator = require('../schemas/project');
const { queryOptionsMiddleware, permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');

const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_FUTURE_PROJECT,
    CLAIM_TYPES.EDIT_FUTURE_PROJECT,
  ],
});

const edit = permissionCheckMiddleware({
claims: [
    CLAIM_TYPES.EDIT_FUTURE_PROJECT,
  ],
});

router.get('/', view, queryOptionsMiddleware, FutureProjectController.getFutureProjects,);
router.get('/:id', view, ProjectController.getProject,);
router.post('/', edit, validate(projectValidator.create), FutureProjectController.createFutureProject,);
router.put('/:id', edit, validate(projectValidator.update), ProjectController.updateProject,);
router.patch('/:id/addVacancy', edit, validate(projectValidator.addVacancy), FutureProjectController.addVacancy,);
router.patch('/:id/updateVacancy', edit, validate(projectValidator.updateVacancy), FutureProjectController.updateVacancy,);
router.patch('/:id/removeVacancy', edit, validate(projectValidator.removeVacancy), FutureProjectController.removeVacancy,);
router.patch('/:id/startProject', edit, validate(projectValidator.startProject), FutureProjectController.startProject,);
router.delete('/', edit, validate(commonValidator.deleteReq), ProjectController.deleteProject,);

module.exports = router;