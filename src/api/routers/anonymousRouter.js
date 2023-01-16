const router = require('express').Router();
const { validate } = require('express-validation');
const { InviteController, UserController, RecipientController } = require('../controllers');
const inviteValidator = require('../schemas/invite');
const userValidator = require('../schemas/user');

router.post('/completeInvite', validate(inviteValidator.completeAccount), InviteController.completeInvite,);
router.post('/user/resetPassword', validate(userValidator.resetPassword), UserController.resetPassword,);
router.post('/user/completeReset', validate(userValidator.completeResetPassword), UserController.completeResetPassword,);
router.get('/unsubscribe/:email/:mailingId/:requestHash', RecipientController.unsubscribe,);

module.exports = router;