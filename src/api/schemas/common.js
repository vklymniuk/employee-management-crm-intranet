const { Joi } = require('express-validation');
const { id, string } = require('./rules');

const deleteReq = {
  params: Joi.object({
    id: id.required(),
  }),
};

const keyReq = {
  params: Joi.object({
    key: string.required(),
  }),
};

module.exports = {
  deleteReq,
  keyReq,
};