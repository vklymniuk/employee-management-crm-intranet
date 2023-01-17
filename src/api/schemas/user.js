const { Joi } = require('express-validation');
const { id, email, password } = require('./rules');

const update = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    email: email.required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    roleId: id,
  }).unknown(),
};

const changePassword = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    oldPassword: password.required(),
    newPassword: password.required(),
  }),
};

const resetPassword = {
  body: Joi.object({
    email: email.required(),
  }),
};

const completeResetPassword = {
  body: Joi.object({
    email: email.required(),
    token: Joi.string().required(),
    password: password.required(),
  }),
};

const updateCurrentUser = {
  body: Joi.object({
    email: email.required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const changeCurrentUserPwd = {
  body: Joi.object({
    oldPassword: password.required(),
    newPassword: password.required(),
  }),
};

module.exports = {
  update,
  resetPassword,
  completeResetPassword,
  updateCurrentUser,
  changeCurrentUserPwd,
  changePassword,
};