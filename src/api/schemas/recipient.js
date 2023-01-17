const { Joi } = require('express-validation');
const {
  email, id, nullableString,
} = require('./rules');

const create = {
  body: Joi.object({
    lastName: nullableString.allow(''),
    title: nullableString.allow(''),
    companyName: nullableString.allow(''),
    email: email.required(),
    email: nullableString.allow(''),
    directPhone: nullableString.allow(''),
    address: nullableString.allow(''),
    city: nullableString.allow(''),
    state: nullableString.allow(''),
    postalCode: nullableString.allow(''),
    phone: nullableString.allow(''),
    url: nullableString.allow(''),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

const bulkDelete = {
  body: Joi.object({
    ids: Joi.array().items(id.required()),
  }),
};

const bulkAddDeleteFromGroups = {
  body: Joi.object({
    recipientIds: Joi.alternatives().try(Joi.array().items(id.required()), id.required()),
    groupIds: Joi.alternatives().try(Joi.array().items(id.required()), id.required()),
  }),
};

module.exports = {
  create,
  update,
  bulkDelete,
  bulkAddDeleteFromGroups,
};