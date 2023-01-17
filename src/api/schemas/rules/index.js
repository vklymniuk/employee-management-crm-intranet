const { Joi } = require('express-validation');

const email = Joi.string().email();
const id = Joi.number();
const link = Joi.string().uri();
const password = Joi.string().regex(/[a-zA-Z0-9]{3,30}/);
const hexColor = Joi.string().regex(/^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i);
const nullableDate = Joi.date().allow(null);
const nullableString = Joi.string().allow(null);
// todo: Add phone validation
const phone = Joi.string();
const string = Joi.string();
const boolean = Joi.boolean();
const date = Joi.date();
const array = Joi.array();
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const number = id;

module.exports = {
  id,
  email,
  link,
  password,
  phone,
  hexColor,
  nullableDate,
  nullableString,
  string,
  boolean,
  date,
  array,
  objectId,
  number,
};