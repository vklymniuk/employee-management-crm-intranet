const { Joi } = require('express-validation');
const {
  email, id, link,
} = require('./rules');

const create = {
  body: Joi.object({
    email: email.required(),
    name: Joi.string().required(),
    linkToCompany: link.allow(null).allow(''),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

const changeProject = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    projects: Joi.array().items(id.required()),
  }),
};

module.exports = { create, update, changeProject, };