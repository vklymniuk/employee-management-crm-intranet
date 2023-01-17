const { Joi } = require('express-validation');
const {
  id, date, string, boolean, array, email,
} = require('./rules');

const create = {
  body: Joi.object({
    name: string.required(),
    type: string.required(),
    start: date.required(),
    end: date.required(),
    description: string.optional().allow(null),
    statusId: id.required(),
    resourceId: id.required(),
    approvedByClient: boolean.strict().required(),
    impactsRevenue: boolean.strict().required(),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

const addVacationRecipientEmail = {
  body: Joi.object({
    resourceId: id.strict().required(),
    email: email,
  }),
};

const updateVacationRecipientEmail = {
  body: Joi.object({
    data: array.required().items({
      resourceId: id.strict().required(),
      email,
    }),
  }),
};

module.exports = {
  create,
  update,
  addVacationRecipientEmail,
  updateVacationRecipientEmail,
};