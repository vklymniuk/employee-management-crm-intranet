const ServicesFactory = require('../../services');

async function getMailingSenders(req, res, next) {
  try {

    const mailingSenderService = ServicesFactory.createMailingSenderService();
    const result = await mailingSenderService.getMultiple();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getMailingSendersByCompany(req, res, next) {
  try {

    const mailingSenderService = ServicesFactory.createMailingSenderService();
    const result = await mailingSenderService.getByMailingId(req.params.mailingId);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateMailingSender(req, res, next) {
  try {

    const mailingSenderService = ServicesFactory.createMailingSenderService();
    const result = await mailingSenderService.updateMailingSender(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createMailingSender(req, res, next) {
  try {

    const mailingSenderService = ServicesFactory.createMailingSenderService();
    const result = await mailingSenderService.createMailingSender(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteMailingSender(req, res, next) {
  try {

    const mailingSenderService = ServicesFactory.createMailingSenderService();
    await mailingSenderService.deleteMailingSender(req.params.id);
    res.send(204);
    
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMailingSenders,
  deleteMailingSender,
  createMailingSender,
  updateMailingSender,
  getMailingSendersByCompany,
};
