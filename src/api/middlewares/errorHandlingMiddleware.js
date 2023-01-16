const Sequelize = require('sequelize');
const { ValidationError } = require('express-validation');
const ResponseErrorModel = require('./helperModels/responseErrorModel');
const { ApiBaseError } = require('../../common/errors');

// eslint-disable-next-line no-unused-vars
function errorHandlingMiddleware(err, req, res, next) {

  if (err instanceof Sequelize.ValidationError) {
    res.status(400).send(new ResponseErrorModel(400, err.errors.map((error) => error.message)));
  } else if (err instanceof ApiBaseError) {
    res.status(err.statusCode).send(new ResponseErrorModel(err.statusCode, err.message));
  } else if (err instanceof Sequelize.ForeignKeyConstraintError) {
    res.status(400).send(new ResponseErrorModel(400, `${err.table} with ${err.fields.join(',')} is not exist`));
  } else if (err instanceof ValidationError) {
    const errorData = err.details.body ? err.details.body : err.details.params;
    res.status(400).send(new ResponseErrorModel(400, errorData.map((x) => x.message)));
  } else {
    res.status(500).send(new ResponseErrorModel(500, err.message));
  }
  console.log(err);
}

module.exports = errorHandlingMiddleware;