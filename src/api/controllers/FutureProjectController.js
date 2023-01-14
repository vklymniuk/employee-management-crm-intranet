const ServicesFactory = require('../../services');
const { PROJECT_STATUSES } = require('../../common/consts');
const { ORDER } = require('../../common/consts/common');
const { futureProjectFilters } = require('../filters');

async function getFutureProjects(req, res, next) {
  try {
    const projectService = ServicesFactory.createFutureProjectService();

    if (!req.queryOptions.sorters.length) {
      req.queryOptions.sorters.push(
        {
          key: 'startDate',
          order: ORDER.ASC,
        },
        {
          key: 'title',
          order: ORDER.ASC,
        },
      );
    }

    const filteredData = await futureProjectFilters(req.queryOptions);

    if (filteredData) {
      res.send(filteredData);
    } else {
      const result = await projectService.getFutureProjects(req.queryOptions);
      res.send(result);
    }

  } catch (err) {
    next(err);
  }
}

async function createFutureProject(req, res, next) {
  try {
    const projectService = ServicesFactory.createProjectService();

    // Set UPCOMING status to all future projects
    req.body.projectStatusId = PROJECT_STATUSES.UPCOMING;
    const project = await projectService.createProject(req.body);
    res.status(201).send(project);

  } catch (err) {
    next(err);
  }
}

async function addVacancy(req, res, next) {
  try {

    const projectService = ServicesFactory.createFutureProjectService();
    const result = await projectService.addVacancy(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function updateVacancy(req, res, next) {
  try {

    const projectService = ServicesFactory.createFutureProjectService();
    const result = await projectService.updateVacancy(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function removeVacancy(req, res, next) {
  try {

    const projectService = ServicesFactory.createFutureProjectService();
    const result = await projectService.removeVacancy(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function startProject(req, res, next) {
  try {

    const projectService = ServicesFactory.createFutureProjectService();
    const result = await projectService.startProject(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { getFutureProjects, createFutureProject, addVacancy, updateVacancy,removeVacancy, startProject, };