const { FUTURE_PROJECT_FILTER } = require('../../common/consts');

async function filterByTechnologies(project, filter) {
  const result = project.toJSON();
  const { key: filterKey } = filter;
  const filterValue = filter.value;

  if (!result.vacancies || !result.vacancies.length) {
    return false;
  }

  const tempTechnologyIds = [];
  const tempTechnologyTypeIds = [];

  result.vacancies.forEach((vacancy) => {
    tempTechnologyIds.push(String(vacancy.technologyId));
    tempTechnologyTypeIds.push(String(vacancy.technologyTypeId));
  });

  const iterator = filterKey === FUTURE_PROJECT_FILTER.TECHNOLOGY ? tempTechnologyIds : tempTechnologyTypeIds;

  if (!Array.isArray(filterValue)) {
    return iterator.includes(filterValue) ? result : false;
  }

  return iterator.some((r) => filterValue.includes(r)) ? result : false;
}

async function getFutureProjectByTechnologies(projects, filter) {
    const result = await Promise.all(
        projects.map((project) => filterByTechnologies(project, filter)),
    );

    return result.filter((p) => p);
}

module.exports = { getFutureProjectByTechnologies, };