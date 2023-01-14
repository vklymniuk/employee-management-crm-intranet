const stream = require('stream');
const ServicesFactory = require('../../services');
const { ExcelHelpers, GroupHelpers, ExternalPaginationHelpers,} = require('../../common/helpers');
const { getResourceResponse, getResourcesResponse, getResourcesByTimelineResponse,} = require('../viewModels/resourceResponse');

async function createResource(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    const result = await resourceService.createResource(req.body);
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function getResources(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();

    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push({ key: 'lastName', order: 'asc', });
    }

    const result = await resourceService.getResources(req.queryOptions);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    result.resources = await getResourcesResponse(result.resources, assignTypes.items, req.user.claims);

    if (req.queryOptions.groupBy) {
      result.resources = GroupHelpers.groupResourcesByAssignmentType(result.resources);
    }

    res.send(result);
  } catch (err) {
    next(err);
  }
}

async function getResource(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.getResourceDetails(req.params.id);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function getVacationDaysLeft(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.getResourceVacationDaysLeft(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();

    // Dont allow to change this field directly
    delete req.body.paidVacationDaysLeft;
    delete req.body.unpaidVacationDaysLeft;

    const result = await resourceService.updateResource(req.params.id, req.body);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function deleteResource(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.deleteResource(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function addTechnology(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.addTechnologyToResource(req.params.id, req.body.technologyId);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function updateTechnologies(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.updateTechnologiesForResource(req.params.id, req.body.technologies);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function removeTechnology(req, res, next) {
  try {

    const { body } = req;
    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.removeTechnologyFromResource( req.params.id, body.technologyId, );
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function addProject(req, res, next) {
  try {

    const { projectId, assignmentTypeId, } = req.body;
    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.addProject(req.params.id, { projectId, assignmentTypeId, });
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function removeProject(req, res, next) {
  try {

    const { projectId } = req.body;
    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.removeProject(req.params.id, projectId);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.updateProject(req.params.id, req.body);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function updateProjects(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.updateProjects(req.params.id, req.body);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function updateAssignmentType(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.updateAssignmentType(req.params.id, req.body);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    res.send(await getResourceResponse(result, assignTypes.items, req.user.claims));

  } catch (err) {
    next(err);
  }
}

async function exportExcel(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();
    const result = await resourceService.getResources(req.queryOptions);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();
    result.resources = await getResourcesResponse(result.resources, assignTypes.items, req.user.claims);
    const file = ExcelHelpers.buildResourceExcel(result.resources, req.body.columns);
    const fileContent = Buffer.from(file, 'base64');
    const readStream = new stream.PassThrough();
    readStream.end(fileContent);
    res.set('Content-disposition', 'attachment; filename=report.xlsx');
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    readStream.pipe(res);

  } catch (err) {
    next(err);
  }
}

async function getResourcesByTimeline(req, res, next) {
  try {

    const resourceService = ServicesFactory.createResourceService();

    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push({ key: 'lastName', order: 'asc',});
    }
    const result = await resourceService.getResourcesByTimeline(req.queryOptions);
    const assignmentTypesService = ServicesFactory.createAssignmentTypeService();
    const assignTypes = await assignmentTypesService.getAll();

    const date = {
      start: req.query.start || null,
      end: req.query.end || null,
    };

    result.resources = await getResourcesByTimelineResponse(
      result.resources,
      assignTypes.items,
      date,
      req.user.claims,
    );

    if (req.queryOptions.groupBy) {
      result.resources = GroupHelpers.groupResourcesByAssignmentType(result.resources);
    }

    const resultWithPagination = ExternalPaginationHelpers.getPagination(
      result.resources,
      req.queryOptions.pagination,
    );

    res.send(resultWithPagination);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  addTechnology,
  removeTechnology,
  exportExcel,
  addProject,
  removeProject,
  updateProject,
  updateAssignmentType,
  getVacationDaysLeft,
  getResourcesByTimeline,
  updateProjects,
  updateTechnologies,
};
