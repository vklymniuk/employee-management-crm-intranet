class ResponseErrorModel {
  constructor(statusCode, errors) {
    this.statusCode = statusCode;

    if (errors instanceof Array) {
      this.errors = errors;
    } else {
      this.errors = [];
      this.errors.push(errors);
    }

  }
}
  
module.exports = ResponseErrorModel;  