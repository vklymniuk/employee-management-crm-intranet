const { Joi } = require('express-validation');
const { id, hexColor } = require('./rules');

const create = {
  body: Joi.object({
    title: Joi.string().required(),
    color: hexColor.required(),
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