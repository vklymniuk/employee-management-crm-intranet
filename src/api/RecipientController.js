const crypto = require('crypto');
const { config } = require('../../config');
const EmailsFactory = require('../factories/emailsFactory');
const { COMMON } = require('../../common/consts');
const ServicesFactory = require('../../services');

const { ORDER } = COMMON;

async function getRecipients(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();

    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push({
        key: 'lastName',
        order: ORDER.ASC,
      }, {
        key: 'id',
        order: ORDER.ASC,
      });
    }

    const result = await recipientService.getRecipients(req.queryOptions);
    res.send(result);
  } catch (err) {
    next(err);
  }
}

async function updateRecipient(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    const result = await recipientService.updateRecipient(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createRecipient(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    const result = await recipientService.createRecipient(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteRecipient(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    await recipientService.deleteRecipient(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function bulkDeleteRecipients(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    await recipientService.bulkDeleteRecipients(req.body);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function bulkDeleteRecipientsFromGroups(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    let { recipientIds } = req.body;
    let { groupIds } = req.body;
    recipientIds = Array.isArray(recipientIds) ? recipientIds : [recipientIds];
    groupIds = Array.isArray(groupIds) ? groupIds : [groupIds];
    await recipientService.bulkDeleteRecipientsFromGroups(recipientIds, groupIds);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function bulkAddRecipientsToGroups(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    let { recipientIds } = req.body;
    let { groupIds } = req.body;
    recipientIds = Array.isArray(recipientIds) ? recipientIds : [recipientIds];
    groupIds = Array.isArray(groupIds) ? groupIds : [groupIds];
    await recipientService.bulkAddRecipientsToGroups(recipientIds, groupIds);
    res.send(204);
    
  } catch (err) {
    next(err);
  }
}

async function importExcel(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    const result = await recipientService.importExcel(req.query);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getStates(req, res, next) {
  try {
    
    const recipientService = ServicesFactory.createRecipientService();
    const result = await recipientService.getStates(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getCities(req, res, next) {
  try {

    const recipientService = ServicesFactory.createRecipientService();
    const result = await recipientService.getCities(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function unsubscribe(req, res, next) {
  try {

    const { email, requestHash, mailingId } = req.params;
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(`${email}${mailingId}${config.subscription.hash}`);
    const validHash = hash.digest('hex');

    if (requestHash == validHash) {
      const smtp = ServicesFactory.createSmtpService();
      const recipientService = ServicesFactory.createRecipientService();
      const mailingService = ServicesFactory.createMailingService();
      await recipientService.unsubscribe(email);
      
      mailingService.getMailingWithUser(mailingId).then((mailing) => {
        recipientService.getRecipientByEmail(email)
          .then((recipient) => {
            const letter = EmailsFactory.createUnsubscribedRecipientEmail(
              recipient,
              mailing.user.email,
            );

            if (letter) {
              smtp.sendEmail(letter);
              const respond = {
                status: 'ok',
                message: 'You Successfully Unsubscribed',
              };
              res.send(respond);
            }
            
          });
      });
    } else {
      const respond = {
        status: 'error',
        message: 'Invalid hash',
      };
      res.send(respond);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecipients,
  deleteRecipient,
  bulkDeleteRecipients,
  bulkDeleteRecipientsFromGroups,
  bulkAddRecipientsToGroups,
  createRecipient,
  updateRecipient,
  importExcel,
  unsubscribe,
  getStates,
  getCities,
};
