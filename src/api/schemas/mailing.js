const { Joi } = require('express-validation');
const {
  id, nullableString, nullableDate,
} = require('./rules');

const create = {
  body: Joi.object({
    title: nullableString.allow(''),
    startedDate: nullableDate.allow(''),
    numberRecipients: Joi.number(),
    interval: Joi.number(),
    sendersEmails: nullableString.allow(''),
    progress: Joi.number().allow(null),
    status: Joi.number(),
    campaignId: id.allow(null),
    sendToSender: Joi.boolean().allow(null),
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