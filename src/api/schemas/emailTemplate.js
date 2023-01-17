const { Joi } = require('express-validation');
const {
  id, nullableString,
} = require('./rules');

const create = {
  body: Joi.object({
    name: nullableString.allow(''),
    template: nullableString.allow(''),
    campaignId: id.allow(null),
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