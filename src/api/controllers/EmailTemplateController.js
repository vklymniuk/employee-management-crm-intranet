const ServicesFactory = require('../../services');

async function getEmailTemplate(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    const result = await emailTemplateService.getEmailTemplate(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getEmailTemplates(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    const result = await emailTemplateService.getEmailTemplates(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateEmailTemplate(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    const result = await emailTemplateService.updateEmailTemplate(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createEmailTemplate(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    const result = await emailTemplateService.createEmailTemplate(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteEmailTemplate(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    await emailTemplateService.deleteEmailTemplateById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function uploadEmailTemplateAsset(req, res, next) {
  try {

    const emailTemplateService = ServicesFactory.createEmailTemplateService();
    const result = await emailTemplateService.uploadEmailAsset(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { getEmailTemplates, getEmailTemplate, deleteEmailTemplate, createEmailTemplate, updateEmailTemplate, uploadEmailTemplateAsset,};