const { Helpers } = require('../../common/helpers');
const { config } = require('../../config');
const { COMMON } = require('../../common/consts');

class EmailsFactory {
  static createInvitationEmail(invitationEmail, token, redirectRoute) {
    const redirectUrl = Helpers.combineUrlWithParameters(
      redirectRoute, { token, invitationEmail }, config.frontPaths.completeRegistration,
    );

    const emailHtml = `Click <a href=${redirectUrl}>here</a> to complete registration`;
    const email = { to: invitationEmail, subject: 'Invite SWAN INTRANET', html: emailHtml, };

    return email;
  }

  static createResetPasswordEmail(token, email, redirectRoute) {
    const redirectUrl = Helpers.combineUrlWithParameters(
      redirectRoute,
      { token, email },
      config.frontPaths.resetPassword,
    );
    const emailHtml = `Click <a href=${redirectUrl}>here</a> to reset password`;
    const emailMessage = { to: email, subject: 'Reset Password SWAN INTRANET', html: emailHtml, };

    return emailMessage;
  }

  static createNewPasswordEmail(password, email, redirectRoute) {
    const redirectUrl = Helpers.combineUrlWithParameters(
      redirectRoute,
      {},
      config.frontPaths.signIn,
    );
    const emailHtml = `Your new password: ${password} .Go to <a href=${redirectUrl}>sign in</a> page.`;
    const emailMessage = { to: email, subject: 'Reset Password SWAN INTRANET', html: emailHtml, };

    return emailMessage;
  }

  static createContractExpiration(resource, to, type = COMMON.CONTRACT_EXPIRATION_TYPE.MONTH) {

    if (!resource) {
      return null;
    }

    const resourceUrl = new URL(config.frontPaths.frontRootUrl);
    resourceUrl.pathname = `/${config.frontPaths.resource}/${resource.id}`;
    const contractDate = new Date(resource.contractEndDate);
    const emailHtml = `
      Resource contract will expire in a ${type}!<br/>
      <strong>Resource:</strong> <a href=${resourceUrl.toString()}>${resource.firstName} ${resource.lastName}</a><br/>
      <strong>Contract Date:</strong> ${COMMON.MONTH_NAMES[contractDate.getMonth()]} ${contractDate.getDate()} ${contractDate.getFullYear()}<br/>
      ${resource.skype ? `<strong>Skype:</strong> ${resource.skype}<br/>` : ''}
      ${resource.phone ? `<strong>Phone:</strong> ${resource.phone}<br/>` : ''}
      ${resource.email ? `<strong>Email:</strong> ${resource.email}<br/>` : ''}
    `;
    const emailMessage = { to, subject: 'Resource Contract Expiration', html: emailHtml, };

    return emailMessage;
  }

  static createBirthdayEmail(resource, to) {

    if (!resource) {
      return null;
    }

    const resourceUrl = new URL(config.frontPaths.frontRootUrl);
    resourceUrl.pathname = `/${config.frontPaths.resource}/${resource.id}`;
    const emailHtml = `
      Today is a <a href=${resourceUrl.toString()}>${resource.firstName} ${resource.lastName}</a> birthday!<br/>
      ${resource.skype ? `<strong>Skype:</strong> ${resource.skype}<br/>` : ''}
      ${resource.phone ? `<strong>Phone:</strong> ${resource.phone}<br/>` : ''}
      ${resource.email ? `<strong>Email:</strong> ${resource.email}<br/>` : ''}
    `;
    const emailMessage = { to, subject: 'Resource Birthday', html: emailHtml, };

    return emailMessage;
  }

  static createMarketingEmail(subject, content, from, to) {
    const emailMessage = { from, to, subject, html: content,};

    return emailMessage;
  }

  static createUnsubscribedRecipientEmail(recipient, to) {
    const subject = 'Recipient unsubscribed';
    const content = `${recipient.firstName} ${recipient.lastName} ${recipient.email} unsubscribed`;
    const emailMessage = { to, subject, html: content, };
    return emailMessage;
  }

  static createMailingFinishedEmail(mailing, to) {
    const subject = 'Mailing finished';
    const content = `${mailing.title} finished`;
    const emailMessage = { to, subject, html: content, };

    return emailMessage;
  }

  static createVacationEmail(
    resourceName, eventLink, to, type = COMMON.VACATION_EMAIL_TYPE.CREATED) {
    const subject = `Vacation for ${resourceName}`;
    const content = `Vacation ${type} for <b>${resourceName}</b>. <br><br> Link to event: ${eventLink}`;
    const emailMessage = { to, subject, html: content, };

    return emailMessage;
  }
}

module.exports = EmailsFactory;
