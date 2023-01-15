const router = require('express').Router();
const { validate } = require('express-validation');
const { UserUpload } = require('../expressConfigs/multerConfig');
const { UserController } = require('../controllers');
const { CLAIM_TYPES } = require('../../common/consts');
const { permissionCheckMiddleware, queryOptionsMiddleware } = require('../middlewares');
const commonValidator = require('../schemas/common');
const userValidator = require('../schemas/user');
const upload = UserUpload();
// current user
const view = permissionCheckMiddleware({
  claims: [
    CLAIM_TYPES.VIEW_USER,
    CLAIM_TYPES.VIEW_ACTION_LOGS,
    CLAIM_TYPES.EDIT_USER,
  ],
});
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_USER],
});

router.get('/current', UserController.getCurrentUser);
router.put('/current', upload.single('avatar'), validate(userValidator.updateCurrentUser), UserController.updateCurrentUser,);
router.get('/current/details', UserController.userDetails);
router.patch('/current/changePassword', validate(userValidator.changeCurrentUserPwd), UserController.changeCurrentUserPassword,);
router.get('/', view, queryOptionsMiddleware, UserController.getAllUsers,);
router.put('/:id', editOnly, validate(userValidator.update), UserController.updateUser,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), UserController.deleteUser,);
router.patch('/:id/newPassword', editOnly, UserController.resetPasswordForUser,);

module.exports = router;
