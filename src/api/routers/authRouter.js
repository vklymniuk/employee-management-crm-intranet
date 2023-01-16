const router = require('express').Router();
const { validate } = require('express-validation');
const { AuthController } = require('../controllers');
const authValidator = require('../schemas/auth');

router.post('/signIn', validate(authValidator.signIn), AuthController.signIn);

module.exports = router;