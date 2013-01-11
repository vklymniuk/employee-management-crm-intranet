const ServicesFactory = require('../../services');
const { EmailsFactory } = require('../factories');
const ApiBaseError = require('../../common/errors/apiBaseError');

async function inviteUser(req, res, next) {
  try {

    if (!req.headers.origin) {
      throw new ApiBaseError('Origin header required', 'HeaderRequiredError', 400);
    }

    const { userId } = req.user;
    const inviteService = ServicesFactory.createInviteService();
    const smtp = ServicesFactory.createSmtpService();
    const { invitationEmail, roleId } = req.body;
    const { invite, token } = await inviteService
      .createInvite({ roleId, invitationEmail, sendedByUserId: userId });
    const inviteEmail = EmailsFactory.createInvitationEmail(
      invitationEmail,
      token,
      req.headers.origin,
    );

    await smtp.sendEmail(inviteEmail);
    res.status(201).send(invite);
    
  } catch (err) {
    next(err);
  }
}

async function completeInvite(req, res, next) {
  try {

    const inviteService = ServicesFactory.createInviteService();
    const invite = await inviteService.completeAccount(req.body);
    res.status(201).send(invite);

  } catch (err) {
    next(err);
  }
}

async function getPendingInvites(req, res, next) {
  try {

    const inviteService = ServicesFactory.createInviteService();
    const result = await inviteService.getPendingInvites(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deletePendingInvite(req, res, next) {
  try {

    const { id } = req.params;
    const inviteService = ServicesFactory.createInviteService();
    const result = await inviteService.deleteInvite(id);
    res.status(204).send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { inviteUser, completeInvite, getPendingInvites, deletePendingInvite, };