const { Joi } = require('express-validation');
const { email, password } = require('./rules');

const signIn = {
  body: Joi.object({
    email: email.required(),
    password: password.required(),
    remember: Joi.boolean().default(false),
  }),
};

module.exports = { signIn, };