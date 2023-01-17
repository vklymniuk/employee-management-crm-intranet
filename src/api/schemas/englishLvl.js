const { Joi } = require('express-validation');
const { id } = require('./rules');

const create = {
  body: Joi.object({
    value: Joi.string().required(),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

module.exports = {
  create,
  update,
};