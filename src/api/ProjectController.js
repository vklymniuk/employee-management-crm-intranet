const stream = require('stream');
const ServicesFactory = require('../../services');
const {
  ExcelHelpers,
  SortHelpers,
} = require('../../common/helpers');
const {
  getProjectResponse,
  getProjectsResponse,
  getHistoryResponse,
} = require('../viewModels/projectResponse');

async function getProjects(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.getProjects(req.queryOptions);

    if (req.query.isBoard == 'true') {
      SortHelpers.sortProjectResources(result.projects);
    }

    const empProj = await projectService.getResourcesProjectCount();
    result.projects = await getProjectsResponse(result.projects, empProj);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getResourceHistory(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const resources = await projectService.getResourceHistory(req.params.id);
    res.send(await getHistoryResponse(resources));

  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const project = await projectService.getProject(req.params.id);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(project, empProj));

  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const project = await projectService.createProject(req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.status(201).send(await getProjectResponse(project, empProj));

  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const project = await projectService.updateProject(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount(req.body);
    await projectService.updateResourceHistory(req.params.id, project);
    res.send(await getProjectResponse(project, empProj));
    
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const project = await projectService.deleteProjectById(req.params.id);
    res.status(204).send(project);

  } catch (err) {
    next(err);
  }
}

async function addResource(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.addResource(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function removeResource(req, res, next) {
  try {

    const { id } = req.params;
    const { resourceId } = req.body;
    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.removeResource(resourceId, id);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.updateResource(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function addTechnology(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.addTechnology(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function updateTechnology(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.updateTechnology(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function removeTechnology(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.removeTechnology(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}

async function moveResource(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const { isCopy } = req.query;
    await projectService.moveResource(req.body, isCopy === 'true');
    res.status(200).send();

  } catch (err) {
    next(err);
  }
}

async function exportExcel(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.getProjects(req.queryOptions);
    const empProj = await projectService.getResourcesProjectCount();
    result.projects = await getProjectsResponse(result.projects, empProj);
    const file = ExcelHelpers.buildProjectExcel(result.projects, req.body.columns);
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


async function startProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.startProject(req.params.id);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateWorkload(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const result = await projectService.updateWorkload(req.params.id, req.body);
    const empProj = await projectService.getResourcesProjectCount();
    res.send(await getProjectResponse(result, empProj));

  } catch (err) {
    next(err);
  }
}


module.exports = {
  getProjects,
  getProject,
  updateProject,
  createProject,
  deleteProject,
  addResource,
  removeResource,
  updateResource,
  addTechnology,
  removeTechnology,
  moveResource,
  exportExcel,
  updateTechnology,
  getResourceHistory,
  startProject,
  updateWorkload,
};
