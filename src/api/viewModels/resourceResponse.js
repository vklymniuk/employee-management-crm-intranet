const PathHelpers = require('../../common/helpers/pathHelpers');
const { DateHelpers } = require('../../common/helpers');
const { config } = require('../../config');
const { VACANCY_STATUSES } = require('../../common/consts');
const ServicesFactory = require('../../services');
const { CLAIM_TYPES, RESOURCE_BLOCKS, } = require('../../common/consts');
const { ASSIGNMENT_TYPES } = require('../../common/consts');

function processResult(data, userClaims, isEdit = false) {
  const exclude = [];

  const mainInfo = userClaims.includes(
    isEdit ? CLAIM_TYPES.EDIT_RESOURCE_MAIN_INFO : CLAIM_TYPES.VIEW_RESOURCE_MAIN_INFO,
  );
  const contactInfo = userClaims.includes(
    isEdit ? CLAIM_TYPES.EDIT_RESOURCE_CONTACT_INFO : CLAIM_TYPES.VIEW_RESOURCE_CONTACT_INFO,
  );
  const otherInfo = userClaims.includes(
    isEdit ? CLAIM_TYPES.EDIT_RESOURCE_OTHER_INFO : CLAIM_TYPES.VIEW_RESOURCE_OTHER_INFO,
  );
  const vacationInfo = userClaims.includes(
    isEdit ? CLAIM_TYPES.EDIT_RESOURCE_VACATION_INFO : CLAIM_TYPES.VIEW_RESOURCE_VACATION_INFO,
  );
  const statusInfo = userClaims.includes(
    isEdit ? CLAIM_TYPES.EDIT_RESOURCE_STATUS_INFO : CLAIM_TYPES.VIEW_RESOURCE_STATUS_INFO,
  );

  if (!mainInfo) {
    exclude.push(...RESOURCE_BLOCKS.mainInfo);
  }

  if (!contactInfo) {
    exclude.push(...RESOURCE_BLOCKS.contactInfo);
  }

  if (!otherInfo) {
    exclude.push(...RESOURCE_BLOCKS.otherInfo);
  }

  if (!vacationInfo) {
    exclude.push(...RESOURCE_BLOCKS.vacationInfo);
  }

  if (!statusInfo) {
    exclude.push(...RESOURCE_BLOCKS.statusInfo);
  }

  const result = {};

  Object.keys(data)
    .forEach((el) => {
      if (!exclude.includes(el)) {
        result[el] = data[el];
      }
    });

  return result;
}

async function getResourceResponse(resource, assignmentTypes = [], userClaims) {
  const result = resource.toJSON();
  result.avatar = await PathHelpers.getAvatarPath(result.id, config.filePath.folders.resourceAvatar);

  if (result.projects.length) {
    const project = result.projects.sort(
      (first, second) => first.resourceProject.order - second.resourceProject.order,
    )[0];
    const projAssignType = assignmentTypes.find(
      (x) => x.id === project.resourceProject.assignmentTypeId,
    );
    result.assignmentType = projAssignType || result.defaultAssignmentType;
    // added assignmentTypeId to response to correctly manage state on FE
    result.assignmentTypeId = result.assignmentType.id;
    result.projects.map((x) => {
      const proj = x;
      const assignType = assignmentTypes.find(
        (type) => type.id === x.resourceProject.assignmentTypeId,
      );
      proj.resourceProject.assignmentType = assignType;

      return project;
    });

    result.projects.sort((a, b) => (a.resourceProject && b.resourceProject ? a.resourceProject.order - b.resourceProject.order : -1));
  } else {
    result.assignmentType = result.defaultAssignmentType;
    // added assignmentTypeId to response to correctly manage state on FE
    result.assignmentTypeId = result.defaultAssignmentType?.id;
  }

  // case when AssignmentType is missing on FE(resources list)
  // FE depends on currentAssignmentType
  // todo refactor AssignmentType
  // currentAssignmentTypeId field in resource table probably has no sense
  // because the project of this AssignmentType can be deleted
  result.currentAssignmentTypeId = result.assignmentTypeId;
  result.currentAssignmentType = result.assignmentType;

  if (result.technologies) {
    const tempArray = [];
    result.technologies.forEach((tech) => {
      const mappedTech = {
        id: tech.id,
        title: tech.title,
        abbreviation: tech.abbreviation,
        technologyType: tech.technologyType,
        isTechlead: tech.resourceTechnology.isTechlead,
      };

      const isPrimary = result.primaryTechnologyId === tech.id;
      const isSecondary = result.secondaryTechnologyId === tech.id;

      if (!isPrimary && !isSecondary) {
        tempArray.push(mappedTech);
      }
    });
    result.technologies = tempArray;
  }

  /* Calculate days until the vacation end */
  if (result.vacations && !resource.showAllVacations) {

    result.vacations = result.vacations.filter((i) => {
      const startDate = DateHelpers.isDateInCurrentMonth(i.start);
      const endDate = DateHelpers.isDateInCurrentMonth(i.end);

      return startDate || endDate;
    });

    if (result.vacations.length >= 1) {
      const idx = result.vacations.findIndex((i) => new Date() >= new Date(i.start));
      const vacation = result.vacations[idx];
      result.vacationsDaysLeft = vacation
        ? DateHelpers.amountOfDaysInDate(vacation.end)
        : null;
    } else {
      result.vacationsDaysLeft = null;
    }

  } else {
    result.vacations = result.vacations.filter((i) => DateHelpers.isDateAfter(i.end));
  }

  /* Calculate days until the project end */
  if (result.projects.length >= 1) {
    const arr = result.projects;

    // Finding min order in resources project
    const min = Math.min(
      ...arr.map((x) => x.resourceProject && x.resourceProject.order),
    );

    // Find and return  project by min order field
    const project = arr.find((x) => x.resourceProject.order === min);
    const endDate = project.expectedEndDate;

    if (project.actualEndDate) {
      result.projectDaysLeft = null;
    }

    const projectDaysLeft = DateHelpers.amountOfDaysInDate(endDate);

    if (projectDaysLeft <= 14) {
      result.projectDaysLeft = project ? projectDaysLeft : null;
    }

  } else {
    result.projectDaysLeft = null;
  }

  return processResult(result, userClaims);
}

async function getResourcesResponse(resources, assignmentTypes, userClaims) {
  return Promise.all(
    resources.map( (resource) => getResourceResponse(resource, assignmentTypes, userClaims), ),
  );
}

async function getResourceFutureProjects(id) {

  const futureProjectService = ServicesFactory.createFutureProjectService();
  const futureProjects = await futureProjectService.getFutureProjects({
    filters: [
      {
        key: 'vacancyResources',
        value: String(id),
      },
      {
        key: 'vacancyStatus',
        value: VACANCY_STATUSES.APPROVED,
      },
    ],
  });

  return futureProjects.projects;
}

async function getResourceByTimelineResponse(resource, assignmentTypes, date, userClaims) {
    
  const entity = await getResourceResponse(resource, assignmentTypes, userClaims);
  entity.futureProjects = await getResourceFutureProjects(resource.id);

  if (date.start && date.end) {
    /**
     * If resource doesn't have project, it's free
     */
    if (entity?.projects === null && entity?.projects === []) {
      return entity;
    }

    const activeProject = entity?.projects[0];
    if (
      activeProject && (new Date(activeProject.expectedEndDate) >= new Date(date.end))
      && activeProject.resourceProject.assignmentTypeId !== ASSIGNMENT_TYPES.BENCH
    ) {
      return null;
    }
    return entity;

    // const activeProjectsChecker = entity?.projects.map((project) => {
    //   return !(new Date(project.expectedEndDate) > new Date(date.end)
    //     && project?.resourceProject.assignmentTypeId !== ASSIGNMENT_TYPES.BENCH);
    // });
    //
    // const isFree = activeProjectsChecker.some((e) => e === true);
    //
    // if (isFree) {
    //   return entity;
    // }
    // return null;
  }

  return entity;
}

async function getResourcesByTimelineResponse(resources, assignmentTypes, date, userClaims) {
  const result = await Promise.all(
    resources
      .map((resource) => {
        resource.showAllVacations = true;

        return getResourceByTimelineResponse(resource, assignmentTypes, date, userClaims);
      }),
  );

  return result.filter((o) => o);
}

module.exports = {
  getResourceResponse,
  getResourcesResponse,
  getResourcesByTimelineResponse,
  getResourceByTimelineResponse,
  processResult,
};