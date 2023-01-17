const { Joi } = require('express-validation');
const { id } = require('./rules');

const create = {
  body: Joi.object({
    name: Joi.string().required(),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};
const changeClaim = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    claimId: id.required(),
  }),
};

module.exports = {
  update,
  create,
  changeClaim,
};