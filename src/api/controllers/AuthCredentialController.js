const ServicesFactory = require('../../services');

async function getAuthCredential(req, res, next) {
  try {

    const authCredentialService = ServicesFactory.createAuthCredentialService();
    const result = await authCredentialService.getAuthCredential(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getAuthCredentials(req, res, next) {
  try {

    const authCredentialService = ServicesFactory.createAuthCredentialService();
    const result = await authCredentialService.getAuthCredentials(req.queryOptions);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateAuthCredential(req, res, next) {
  try {

    const authCredentialService = ServicesFactory.createAuthCredentialService();
    const result = await authCredentialService.updateAuthCredential(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createAuthCredential(req, res, next) {
  try {

    const authCredentialService = ServicesFactory.createAuthCredentialService();
    const result = await authCredentialService.createAuthCredential(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteAuthCredential(req, res, next) {
  try {

    const authCredentialService = ServicesFactory.createAuthCredentialService();
    await authCredentialService.deleteAuthCredentialById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

module.exports = { getAuthCredentials, getAuthCredential, deleteAuthCredential, createAuthCredential, updateAuthCredential, };