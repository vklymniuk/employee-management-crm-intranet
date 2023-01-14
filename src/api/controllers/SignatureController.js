const ServicesFactory = require('../../services');

async function getSignature(req, res, next) {
  try {

    const signatureService = ServicesFactory.createSignatureService();
    const result = await signatureService.getSignature(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getSignatures(req, res, next) {
  try {

    const signatureService = ServicesFactory.createSignatureService();
    const result = await signatureService.getSignatures(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateSignature(req, res, next) {
  try {

    const signatureService = ServicesFactory.createSignatureService();
    const result = await signatureService.updateSignature(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createSignature(req, res, next) {
  try {

    const signatureService = ServicesFactory.createSignatureService();
    const result = await signatureService.createSignature(req.body);
    res.send(result);
    
  } catch (err) {
    next(err);
  }
}

async function deleteSignature(req, res, next) {
  try {

    const signatureService = ServicesFactory.createSignatureService();
    await signatureService.deleteSignatureById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

module.exports = { getSignatures, getSignature, deleteSignature, createSignature, updateSignature, };