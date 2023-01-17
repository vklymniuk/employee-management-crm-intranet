const { Joi } = require('express-validation');
const { id, email } = require('./rules');

const create = {
  body: Joi.object({
    email: email.required(),
    pass: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

module.exports = { create, update, };