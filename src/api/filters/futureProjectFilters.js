const { FUTURE_PROJECT_FILTER } = require('../../common/consts');
const { ExternalPaginationHelpers } = require('../../common/helpers');
const { getFutureProjectByTechnologies, } = require('../viewModels/futureProjectResponse');
const ServicesFactory = require('../../services');

async function futureProjectFilters(query) {
  let result = null;
  let projects = null;
  const projectService = ServicesFactory.createFutureProjectService();
  const filtersByTechnologies = query.filters.find((p) => p.key === FUTURE_PROJECT_FILTER.TECHNOLOGY,);
  const filtersByTechnologyType = query.filters.find((p) => p.key === FUTURE_PROJECT_FILTER.TECHNOLOGY_TYPE,);

  if (filtersByTechnologies || filtersByTechnologyType) {
    result = await projectService.getFutureProjects({...query, pagination: null,});
  }

  if (filtersByTechnologies) {
    projects = await getFutureProjectByTechnologies(result.projects, filtersByTechnologies,);
  }

  if (filtersByTechnologyType) {
    projects = await getFutureProjectByTechnologies(result.projects, filtersByTechnologyType,);
  }

  if (filtersByTechnologies || filtersByTechnologyType) {
    return ExternalPaginationHelpers.getPagination(projects, query.pagination, 'projects',);
  }

  return null;
}

module.exports = futureProjectFilters;
