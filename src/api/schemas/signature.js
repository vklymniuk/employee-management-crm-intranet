const { Joi } = require('express-validation');
const {
  id,
  link,
  phone,
  nullableString,
} = require('./rules');

const create = {
  body: Joi.object({
    authCredentialId: id.required(),
    name: nullableString.allow(''),
    company: nullableString.allow(''),
    mobile: phone.allow(null).allow(''),
    address: nullableString.allow(''),
    linkedin: link.allow(null).allow(''),
    title: nullableString.allow(''),
  }).unknown(),
};

const update = {
  body: Joi.object({
    name: nullableString.allow(''),
    company: nullableString.allow(''),
    mobile: phone.allow(null).allow(''),
    address: nullableString.allow(''),
    linkedin: link.allow(null).allow(''),
    title: nullableString.allow(''),
  }).unknown(),
  params: Joi.object({
    id: id.required(),
  }),
};

module.exports = {
  create,
  update,
};