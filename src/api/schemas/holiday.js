const { Joi } = require('express-validation');
const { id, array } = require('./rules');

const create = {
  body: Joi.object({
    name: Joi.string().required(),
    day: Joi.number().integer().min(1).max(31),
    month: Joi.number().integer().min(1).max(12),
    availableIn: array.required(id.strict().required()),
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