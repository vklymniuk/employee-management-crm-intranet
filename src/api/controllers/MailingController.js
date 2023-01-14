const ServicesFactory = require('../../services');
const { getMailingResponse, getMailingsResponse } = require('../viewModels/mailingResponse');

async function getMailings(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const result = await mailingService.getMailings(req.queryOptions);
    result.mailings = getMailingsResponse(result.mailings);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getMailing(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const mailing = await mailingService.getMailing(req.params.id);
    const recipientService = ServicesFactory.createRecipientService();
    const mailingRecipients = await recipientService.getAllRecipientByMailingId(req.params.id);
    const result = getMailingResponse(mailing, mailingRecipients);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateMailing(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const recipientService = ServicesFactory.createRecipientService();
    const mailing = await mailingService.updateMailing(req.params.id, req.body);
    const mailingRecipients = await recipientService.getAllRecipientByMailingId(req.params.id);
    const result = getMailingResponse(mailing, mailingRecipients);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createMailing(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const { userId } = req.user;
    const mailing = await mailingService.createMailing(req.body, userId);
    const result = getMailingResponse(mailing);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteMailing(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    await mailingService.deleteMailing(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function selectAllVisible(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const recipientService = ServicesFactory.createRecipientService();
    await recipientService.getMultiple(req.queryOptions).then((result) => {
      mailingService.createRecipientList(req.params.id, result.recipients).then((recipientIds) => { res.send(recipientIds); });
    });

  } catch (err) {
    next(err);
  }
}

async function deselectAllVisible(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const recipientService = ServicesFactory.createRecipientService();
    await recipientService.getMultiple(req.queryOptions).then((result) => {
      mailingService.dropRecipientList(req.params.id, result.recipients).then((remainIds) => { res.send(remainIds); });
    });

  } catch (err) {
    next(err);
  }
}

async function deselectAll(req, res, next) {
  try {

    const mailingService = ServicesFactory.createMailingService();
    const recipientService = ServicesFactory.createRecipientService();
    await recipientService.getMultiple({}).then((result) => {
      mailingService.dropRecipientList(req.params.id, result.recipients).then((remainIds) => { res.send(remainIds); });
    });

  } catch (err) {
    next(err);
  }
}

async function received(req, res, next) {
  try {

    const mailingRecipientService = ServicesFactory.createMailingRecipientService();
    const mailingRecipients = await mailingRecipientService.getReceivedRecipientsByMailingId(req.params.id);
    res.send(mailingRecipients);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMailings,
  getMailing,
  deleteMailing,
  createMailing,
  updateMailing,
  selectAllVisible,
  deselectAllVisible,
  deselectAll,
  received,
};
