const ServicesFactory = require('../../services');
const { EmailsFactory } = require('../factories');
const PathHelpers = require('../../common/helpers/pathHelpers');
const { config } = require('../../config');
const { ApiBaseError } = require('../../common/errors');

async function updateCurrentUser(req, res, next) {

  try {
    const { userId } = req.user;
    const userService = ServicesFactory.createUserService();
    const user = await userService.updateUser(userId, req.body);
    res.status(200).send(user);

  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {

    const { userId } = req.user;
    const userService = ServicesFactory.createUserService();
    const user = await userService.getUserById(userId);
    const avatarUrl = await PathHelpers.getAvatarPath(userId, config.filePath.folders.userAvatar);
    res.status(200).send({ ...user.toJSON(), avatarUrl, });

  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {

    const userService = ServicesFactory.createUserService();
    const users = await userService.getUsers(req.queryOptions);
    res.status(200).send(users);

  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {

    const userService = ServicesFactory.createUserService();
    await userService.deleteUserById(req.params.id);
    res.status(204).send();

  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {

    const userService = ServicesFactory.createUserService();
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).send(user);

  } catch (err) {
    next(err);
  }
}

async function userDetails(req, res, next) {
  try {

    const { userId, claims } = req.user;
    const avatarUrl = await PathHelpers.getAvatarPath(userId, config.filePath.folders.userAvatar);
    const userInfo = { claims, avatarUrl, };
    res.send(userInfo);

  } catch (err) {
    next(err);
  }
}

async function changeCurrentUserPassword(req, res, next) {
  try {

    const userService = ServicesFactory.createUserService();
    const { userId } = req.user;
    await userService.changePassword(userId, req.body);
    res.status(200).send();

  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {

    const { origin } = req.headers;

    if (!origin) {
      throw new ApiBaseError('Origin header required', 'HeaderRequiredError', 400);
    }

    const userService = ServicesFactory.createUserService();
    const smtp = ServicesFactory.createSmtpService();
    const { email } = req.body;
    const { token } = await userService.resetPassword(email);
    const resetEmail = EmailsFactory.createResetPasswordEmail(token, email, origin);
    await smtp.sendEmail(resetEmail);
    res.status(200).send();

  } catch (err) {
    next(err);
  }
}

async function completeResetPassword(req, res, next) {
  try {

    const userService = ServicesFactory.createUserService();
    await userService.completeResetPassword(req.body);
    res.status(200).send();

  } catch (err) {
    next(err);
  }
}

async function resetPasswordForUser(req, res, next) {
  try {

    const { origin } = req.headers;

    if (!origin) {
      throw new ApiBaseError('Origin header required', 'HeaderRequiredError', 400);
    }

    const userService = ServicesFactory.createUserService();
    const smtp = ServicesFactory.createSmtpService();
    const { password, email } = await userService.resetUserPassword(req.params.id);
    const newPassEmail = EmailsFactory.createNewPasswordEmail(password, email, origin);
    await smtp.sendEmail(newPassEmail);
    res.status(200).send();

  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrentUser, getAllUsers, deleteUser, changeCurrentUserPassword, updateUser, updateCurrentUser, userDetails, completeResetPassword, resetPassword, resetPasswordForUser, };
