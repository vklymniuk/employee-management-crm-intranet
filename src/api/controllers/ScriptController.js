const ServicesFactory = require('../../services');

async function getCalendarEvent(req, res, next) {
  try {

    const scriptService = ServicesFactory.createScriptService();
    const result = await scriptService.getAllEvents();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateResourceAssignmentType(req, res, next) {
  try {

    const scriptService = ServicesFactory.createScriptService();
    const result = await scriptService.updateResourceAssignmentType();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function restoreDeletedResources(req, res, next) {
  try {

    const scriptService = ServicesFactory.createScriptService();
    const result = await scriptService.restoreDeletedResources();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { getCalendarEvent, updateResourceAssignmentType, restoreDeletedResources, };