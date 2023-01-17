const { Joi } = require('express-validation');
const { id } = require('./rules');

const create = {
  body: Joi.object({
    title: Joi.string().required(),
    abbreviation: Joi.string().required(),
    technologyTypeId: id.allow(null),
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