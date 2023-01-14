const ServicesFactory = require('../../services');

async function createRole(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const role = req.body;
    const result = await roleService.createRole(role);
    res.status(201).send(result);

  } catch (err) {
    next(err);
  }
}

async function addClaimToRole(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const { id } = req.params;
    const { claimId } = req.body;
    const result = await roleService.addClaimToRole(id, claimId);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function removeClaimFromRole(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const { id } = req.params;
    const { claimId } = req.body;
    const result = await roleService.removeClaimFromRole(id, claimId);
    res.send(result);
    
  } catch (err) {
    next(err);
  }
}

async function getRolesWithClaims(req, res, next) {
  try {
    const roleService = ServicesFactory.createRolesService();
    const claimService = ServicesFactory.createClaimService();
    const roles = await roleService.getRolesWithClaims();
    const claims = await claimService.getClaims();
    res.send({ roles, claims: claims.items,});

  } catch (err) {
    next(err);
  }
}

async function getRoles(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const roles = await roleService.getRoles();
    res.status(200).send(roles.items);

  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const { id } = req.params;
    const role = req.body;
    const result = await roleService.updateRole(id, role);
    res.status(200).send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {

    const roleService = ServicesFactory.createRolesService();
    const { id } = req.params;
    const result = await roleService.deleteRole(id);
    res.status(204).send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { createRole, addClaimToRole, removeClaimFromRole, getRolesWithClaims, getRoles, updateRole, deleteRole, };