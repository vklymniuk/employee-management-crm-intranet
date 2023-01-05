const EntityNotFoundError = require('./entityNotFoundError');
const IncorrectPasswordError = require('./incorrentPasswordError');
const JwtValidationError = require('./jwtValidationError');
const ApiBaseError = require('./apiBaseError');
const PermissionDeniedError = require('./permissionDeniedError');
const RoleNotAssignedError = require('./roleNotAssignedError');
const InternalServerError = require('./internalServerError');
const ActiveTokenNotFoundError = require('./activeTokenNotFound');
const InviteAcceptedError = require('./inviteAcceptedError');
const UpdateParametersNotSettedError = require('./updateParametersNotSettedError');
const FileNotFoundError = require('./fileNotFoundError');
const EntityAlreadyExistError = require('./entityAlreadyExistError');
const ValidationError = require('./validationError');
const EntityDeletionError = require('./entityDeletionError');
const NotImplementedError = require('./notImplementedError');
const DuplicateSettingsError = require('./duplicateSettingsError');

module.exports = {
  EntityNotFoundError,
  IncorrectPasswordError,
  JwtValidationError,
  ApiBaseError,
  PermissionDeniedError,
  RoleNotAssignedError,
  ActiveTokenNotFoundError,
  InternalServerError,
  EntityAlreadyExistError,
  InviteAcceptedError,
  UpdateParametersNotSettedError,
  FileNotFoundError,
  ValidationError,
  EntityDeletionError,
  NotImplementedError,
  DuplicateSettingsError,
};
