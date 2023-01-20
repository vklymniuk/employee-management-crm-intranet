const crypto = require('crypto');
const cheerio = require('cheerio');
const fs = require('fs');

const { config } = require('../../config');
const { DateHelpers, FileHelpers, Helpers } = require('../../common/helpers');
const { TASK_STATUSES, TEMPLATE_DEFAULTS } = require('../../common/consts');
const ServicesFactory = require('../../services');
const EmailsFactory = require('../factories/emailsFactory');

function signatureTemplate(signature) {
  return `<table style="border:none;border-collapse:collapse">
    <tbody>
    <tr style="height:0pt">
    <td style="border-width:0pt;border-style:solid;border-color:rgb(0,0,0);vertical-align:top;padding:5pt">
    <p dir="ltr" style="text-align:center;line-height:1.38;margin-top:0pt;margin-bottom:0pt">
      <a href="https://manageteam.employee.com">
        <img src="#" width="101" height="101" style="border:none" class="CToWUd">
      </a>
    </p>
  </td>
  <td style="border-width:0pt;border-style:solid;border-color:rgb(0,0,0);vertical-align:top;padding:5pt">
    <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt"></p>
    </td>
    <td style="border-width:0pt;border-style:solid;border-color:rgb(0,0,0);vertical-align:top;padding:5pt">
    ${signature.name && `<p dir="ltr" style="color:rgb(0,0,0);font-size:13px;margin-top:0pt;margin-bottom:0pt;padding:0px;line-height:1.38"><span style="font-size:9.5pt;font-weight:700;vertical-align:baseline;white-space:pre-wrap;color:rgb(76,118,162)">${signature.name}</span></p>`}
    ${signature.title && `<p dir="ltr" style="color:rgb(0,0,0);font-size:13px;margin-top:0pt;margin-bottom:0pt;padding:0px;line-height:1.38"><span style="font-size:9.5pt;vertical-align:baseline;white-space:pre-wrap">${signature.title}</span></p>`}
    ${signature.company && `<p dir="ltr" style="color:rgb(0,0,0);font-size:13px;margin-top:0pt;margin-bottom:0pt;padding:0px;line-height:1.38"><span style="font-size:9.5pt;font-weight:700;vertical-align:baseline;white-space:pre-wrap">${signature.company}</span></p>`}
    ${signature.mobile && `<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt"><span style="font-size:9.5pt;font-family:Arial;vertical-align:baseline;white-space:pre-wrap">m: </span><span style="font-size:9.5pt;font-family:Arial;color:rgb(17,85,204);vertical-align:baseline;white-space:pre-wrap">${signature.mobile}</span></p>`}
    ${signature.address && `<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt"><span style="font-family:Arial;font-size:9.5pt;white-space:pre-wrap">a: ${signature.address}</span></p>`}
    ${signature.linkedin && `
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">
        <a href="${signature.linkedin}">
          <img src="#" width="20" height="20" alt="LinkedIn" style="border:none">
        </a>
      </p>
    `}
  </td>
  </tr>
  </tbody>
  </table>`;
}

function notice() {
  return `<p style="font-size: 10px">This email and any attachments are for the exclusive and confidential use of the
    intended recipient. If you are not the intended recipient, please do not read, distribute or
    take any action in reliance upon this message. If you have received this in error, please
    notify Manage Team immediately by return email and promptly delete this message
    and its attachments from your computer and system.</p>`;
}

function unsubscribeLink(email, mailingId) {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(`${email}${mailingId}${config.subscription.hash}`);
  const url = `${config.frontPaths.frontRootUrl}unsubscribe/${email}/${mailingId}/${hash.digest('hex')}`;

  return `<p style="font-size: 10px">If you want to unsubscribe from our emails please click this <a href="${url}">link</a></p>`;
}

function replaceVariables(template, recipient) {
  const test = template.replace(/{{First Name}}/g, (recipient.firstName || ''))
    .replace(/{{Last Name}}/g, recipient.lastName || '')
    .replace(/{{Title}}/g, recipient.title || '')
    .replace(/{{Email}}/g, recipient.email || '')
    .replace(/{{Company Name}}/g, (recipient.companyName || TEMPLATE_DEFAULTS.COMPANY_NAME))
    .replace(/{{Direct Phone}}/g, Helpers.maskPhone(recipient.directPhone) || '')
    .replace(/{{Address}}/g, recipient.address || '')
    .replace(/{{City}}/g, recipient.city || '')
    .replace(/{{State}}/g, recipient.state || '')
    .replace(/{{Postal Code}}/g, recipient.postalCode || '')
    .replace(/{{Type}}/g, recipient.type || '')
    .replace(/{{Industry}}/g, recipient.industry || '')
    .replace(/{{Manager′s Phone}}/g, Helpers.maskPhone(recipient.managersPhone) || '')
    // '′' is prime(apostrophe) symbol, in unicode it is '&#x2032;'
    .replace(/{{Manager&#x2032;s Phone}}/g, Helpers.maskPhone(recipient.managersPhone) || '')
    .replace(/{{Job site}}/g, recipient.jobSite || '')
    .replace(/{{Company Phone}}/g, Helpers.maskPhone(recipient.phone) || '')
    .replace(/{{Job title}}/g, recipient.jobTitle || '')
    .replace(/{{Posting link}}/g, recipient.postingLink || '')
    .replace(/{{Url}}/g, recipient.url || '');

  return test;
}

async function replaceTemplateUrls(template, templateId) {
  const $ = cheerio.load(template);
  const saveFolder = `${config.filePath.staticFiles}/${config.filePath.folders.emails}`;
  const templateFolder = `${saveFolder}/${templateId}`;
  const pathExist = await FileHelpers.exists(saveFolder);
  const templateFolderExist = await FileHelpers.exists(templateFolder);

  if (!pathExist) {
    fs.mkdirSync(saveFolder);
  }

  if (!templateFolderExist) {
    fs.mkdirSync(templateFolder);
  }

  const imageTags = $('img');
  imageTags.map((index, image) => {
    const imageSrc = $(image).attr('src');
    const filename = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
    const fileToCopy = `${config.filePath.staticFiles}/${config.filePath.folders.assets}/${filename}`;
    const destinationFile = `${templateFolder}/${filename}`;
    const newUrl = imageSrc.replace('assets', `${config.filePath.folders.emails}/${templateId}`);
    fs.copyFileSync(fileToCopy, destinationFile);
    $(image).attr('src', newUrl);

    return image;
  });

  template = $.html();

  return template;
}

async function marketingWorker(task) {
  const mailingService = ServicesFactory.createMailingService();
  const recipientService = ServicesFactory.createRecipientService();
  const mailingSenderService = ServicesFactory.createMailingSenderService();
  const taskService = ServicesFactory.createTaskService();
  const smtp = ServicesFactory.createSmtpService();
  const mailing = await mailingService.getMailingByTaskId(task.id);
  const mailingRecipient = await recipientService.getRecipientByMailingId(mailing.id);
  const signatureService = ServicesFactory.createSignatureService();

  if (mailingRecipient !== null) {
    const { recipient } = mailingRecipient;
    const { template, subject, id } = mailing.emailTemplate;
    const modifiedSubject = replaceVariables(subject, recipient);
    const sentAt = DateHelpers.getCurrentUtc().toDate();
    const mailingSender = (await mailingSenderService.getNextMailingSender(mailing.id))[0];

    if (mailingSender) {
      const { authCredential } = mailingSender;

      if (!authCredential) {
        return;
      }

      const newTemplate = await replaceTemplateUrls(template, id);
      let content = replaceVariables(newTemplate, recipient);
      const signature = await signatureService.getByAuthCredentialId(authCredential.id);
      content += signatureTemplate(signature);
      content += unsubscribeLink(recipient.email, mailing.id);
      content += notice();
      const gmail = ServicesFactory.createGmailService(authCredential);
      const email = EmailsFactory.createMarketingEmail(
        modifiedSubject,
        content,
        authCredential.email,
        recipient.email,
      );

      try {
              if (email) {
                  await mailingSenderService.incLettersCount(mailingSender);
                  await gmail.sendEmail(email);
                  mailingRecipient.sentAt = sentAt;
                  await mailingRecipient.save();
                  await recipientService.incrementLettersCount(recipient);
                  recipient.lastContacted = sentAt;
                  await recipient.save();
              }

              const result = await recipientService.getAllRecipientByMailingId(mailing.id);

              if (result.count > 0) {
                  const total = result.count;
                  const done = result.rows.map((item) => item.sentAt)
                      .filter((x) => x != null).length;

                  // Send one email to sender)
                  const { lettersCount } = mailingSender;

                  if (lettersCount === 0 && mailing.sendToSender) {
                      await gmail.sendEmail(EmailsFactory.createMarketingEmail(
                          modifiedSubject,
                          content,
                          authCredential.email,
                          authCredential.email,
                      ));
                  }

                  const progress = (done * 100) / total;

                  if (progress == 100) {
                      task.status = TASK_STATUSES.COMPLETED;
                      const letter = EmailsFactory.createMailingFinishedEmail(
                          mailing,
                          mailing.user.email,
                      );

                      if (letter) {
                          smtp.sendEmail(letter);
                      }
                  }
                  task.progress = progress;
                  task.workedAt = sentAt;
                  
                  await taskService.updateTask(task);
              }
        } catch (err) {
      }
    }
  }
}

module.exports = marketingWorker;