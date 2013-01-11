const ServicesFactory = require('../../services');

async function getMailingRecipients(req, res, next) {
  try {

    const mailingRecipientService = ServicesFactory.createMailingRecipientService();
    const result = await mailingRecipientService.getMailingRecipients(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateMailingRecipient(req, res, next) {
  try {

    const mailingRecipientService = ServicesFactory.createMailingRecipientService();
    const result = await mailingRecipientService
      .findOrCreateFor(req.params.mailingId, req.params.recipientId);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createMailingRecipient(req, res, next) {
  try {

    const mailingRecipientService = ServicesFactory.createMailingRecipientService();
    const result = await mailingRecipientService.createMailingRecipient(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteMailingRecipient(req, res, next) {
  try {

    const mailingRecipientService = ServicesFactory.createMailingRecipientService();
    await mailingRecipientService.deleteFor(req.params.mailingId, req.params.recipientId);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

module.exports = { getMailingRecipients, deleteMailingRecipient, createMailingRecipient, updateMailingRecipient,};