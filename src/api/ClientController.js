const ServicesFactory = require('../../services');

async function getClients(req, res, next) {
  try {

    const clientService = ServicesFactory.createClientService();
    const result = await clientService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function updateClient(req, res, next) {
  try {

    const clientService = ServicesFactory.createClientService();
    const result = await clientService.updateClient(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createClient(req, res, next) {
  try {

    const clientService = ServicesFactory.createClientService();
    const result = await clientService.createClient(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteClient(req, res, next) {
  try {

    const clientService = ServicesFactory.createClientService();
    await clientService.deleteClientById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

async function addProjectToClient(req, res, next) {
  try {

    const clientService = ServicesFactory.createClientService();
    const { clientId } = req.params;
    const { projects } = req.body;
    const result = await clientService.addProjectToClient(clientId, projects);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function removeProjectFromClient(req, res, next) {
  try {
    
    const clientService = ServicesFactory.createClientService();
    const { clientId } = req.params;
    const { projects } = req.body;
    const result = await clientService.removeProjectFromClient(clientId, projects);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { getClients, deleteClient, createClient, updateClient, addProjectToClient, removeProjectFromClient, };