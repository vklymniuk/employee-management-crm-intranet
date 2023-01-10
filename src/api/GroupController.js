const ServicesFactory = require('../../services');

async function getGroups(req, res, next) {
  try {

    const groupService = ServicesFactory.createGroupService();
    const result = await groupService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function updateGroup(req, res, next) {
  try {

    const groupService = ServicesFactory.createGroupService();
    const result = await groupService.updateGroup(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createGroup(req, res, next) {
  try {

    const groupService = ServicesFactory.createGroupService();
    const result = await groupService.createGroup(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteGroup(req, res, next) {
  try {

    const groupService = ServicesFactory.createGroupService();
    await groupService.deleteGroupById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

module.exports = { getGroups, deleteGroup, createGroup, updateGroup, };