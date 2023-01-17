const { Joi } = require('express-validation');
const { email, id, password } = require('./rules');

const invite = {
  body: Joi.object({
    invitationEmail: email.required(),
    roleId: id.required(),
  }).unknown(),
};

const completeAccount = {
  body: Joi.object({
    invitationEmail: email.required(),
    password: password.required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    token: Joi.string().required(),
  }).unknown(),
};

module.exports = {
  invite,
  completeAccount,
};