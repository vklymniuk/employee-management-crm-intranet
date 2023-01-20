const { config } = require('../../config');
const PathHelpers = require('../../common/helpers/pathHelpers');
const { RESOURCE_STATUS } = require('../../common/consts');
const { PROJECT_STATUSES } = require('../../common/consts');

async function getProjectResponse(project, resourceProjects) {
  const result = project.toJSON();
  result.avatarUrl = await PathHelpers.getAvatarPath(project.id, config.filePath.folders.projects);

  if (result.startDate !== null || result.expectedEndDate !== null) {
    const formatDate = (date) => {
      const ms = Date.parse(date);

      return Math.floor(ms / 86400000);
    };
    const startDate = formatDate(result.startDate);
    const actualEndDate = formatDate(result.actualEndDate);
    const expectedEndDate = formatDate(result.expectedEndDate);
    const endDate = formatDate(result.actualEndDate || result.expectedEndDate);
    const projectDuration = endDate - startDate;
    const projectDurationNow = result.actualEndDate
      ? projectDuration
      : (formatDate(new Date()) - startDate);
    const remainingDaysToEnd = result.actualEndDate
      ? formatDate(result.expectedEndDate) - formatDate(result.actualEndDate)
      : projectDuration - projectDurationNow;
    const percentComplete = (projectDurationNow / projectDuration) * 100;

    result.durationProject = {
      startDate,
      actualEndDate,
      expectedEndDate,
      endDate,
      projectDuration,
      projectDurationNow,
      remainingDaysToEnd,
      percentComplete,
    };
  }

  const isContainsResources = !!result.resources;

  if (isContainsResources) {
    result.resources.sort((a, b) => a.resourceProject.assignmentTypeId - b.resourceProject.assignmentTypeId);
  }

  const populateResourceData = async (item) => {
    const res = item;
    const emp = resourceProjects.find((x) => item.id === x.id);
    res.avatar = emp ? await PathHelpers.getAvatarPath(emp.dataValues.id, config.filePath.folders.resourceAvatar) : null;
    res.projectsCount = emp ? emp.dataValues.projectsCount : 0;

    return res;
  };

  if (isContainsResources && resourceProjects && resourceProjects.length) {
    await Promise.all(result.resources.map((item) => populateResourceData(item)));
  }

  if (result.projectStatusId && result.projectStatusId !== PROJECT_STATUSES.UPCOMING) {
    delete result.vacancies;
  }

  result.resources = result.resources.filter(
    (resource) => resource.statusFilter === RESOURCE_STATUS.HIRED,
  );

  return result;
}

async function getProjectsResponse(projects, resourceProjects) {
  return Promise.all(projects.map((project) => getProjectResponse(project, resourceProjects)));
}

async function getHistoryResponse(resources) {
  return Promise.all(resources.map((resource) => resource.resource));
}

module.exports = { getProjectResponse, getProjectsResponse, getHistoryResponse, };