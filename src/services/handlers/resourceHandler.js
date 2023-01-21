const { EntityNotFoundError } = require('../../common/errors');

class ResourceHandler {
  constructor(resourceRepository, assignmentTypeRepo, resourceProjRepo, resourceTechRepo) {
    this.resourceRepository = resourceRepository;
    this.assignmentTypeRepo = assignmentTypeRepo;
    this.resourceProjRepo = resourceProjRepo;
    this.resourceTechRepo = resourceTechRepo;
  }

  async computeAssignmentType(resourceId, model) {
    const resourceEntity = await this.resourceRepository.getResourceDetails(resourceId);
    let assignType = model.assignmentTypeId;

    if (!resourceEntity) {
      throw new EntityNotFoundError('Resource', 'id', resourceId);
    }    

    if (resourceEntity.projects && resourceEntity.projects.length && resourceEntity.projects[0].resourceProject) {
      const { projects } = resourceEntity;
      // Finding min order in resources project
      const min = Math.min(...projects.map((x) => x.resourceProject && x.resourceProject.order));
      // Find and return  project by min order field
      const project = projects.find((x) => x.resourceProject.order === min);
      assignType = project.resourceProject.assignmentTypeId;
    } else if (!resourceEntity.projects.length && model.defaultAssignmentTypeId
      // didn't catch the line below so I commented it
      //&& resourceEntity.currentAssignmentTypeId === model.assignmentTypeId
    ) {
      assignType = model.defaultAssignmentTypeId;
    } else if (!model.assignmentTypeId) {
      assignType = resourceEntity.currentAssignmentTypeId;
    }

    return assignType;
  }

  async updateAssignmentTypeForProject(resourceId, assignmentTypeId) {
    const resource = await this.resourceRepository.getResourceDetails(resourceId);

    if (!resource) {
      throw new EntityNotFoundError('Resource', 'id', resourceId);
    }

    const arr = resource.projects;
    // Finding min order in resources project
    const min = Math.min(...arr.map((x) => x.resourceProject && x.resourceProject.order));
    // Find and return  project by min order field
    const project = arr.find((x) => x.resourceProject.order === min);

    if (resource.projects.length) {
      const { resourceProject } = project;

      resourceProject.assignmentTypeId = assignmentTypeId;
      await this.resourceProjRepo.bulkUpdate([resourceProject]);
    }
  }
}

module.exports = ResourceHandler;