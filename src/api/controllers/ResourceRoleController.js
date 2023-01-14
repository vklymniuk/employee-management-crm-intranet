const ServicesFactory = require('../../services');

async function getResourceRoles(req, res, next) {
  try {

    const resourceRoleService = ServicesFactory.createResourceRoleService();
    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push({
        key: 'order',
        order: 'asc',
      });
    }
    
    const result = await resourceRoleService.getAll();
    res.send(result.items);
  } catch (err) {
    next(err);
  }
}

async function updateResourceRole(req, res, next) {
  try {

    const resourceRoleService = ServicesFactory.createResourceRoleService();
    const result = await resourceRoleService.updateRole(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createResourceRole(req, res, next) {
  try {

    const resourceRoleService = ServicesFactory.createResourceRoleService();
    const result = await resourceRoleService.createRole(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteResourceRole(req, res, next) {
  try {

    const resourceRoleService = ServicesFactory.createResourceRoleService();
    await resourceRoleService.deleteRoleById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}
module.exports = {
  getResourceRoles,
  updateResourceRole,
  createResourceRole,
  deleteResourceRole,
};
