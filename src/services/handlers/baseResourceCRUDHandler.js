const { EntityNotFoundError } = require('../../common/errors');

class BaseResourceCRUDHandler {
  constructor(repository, modelName) {
    this.repository = repository;
    this.modelName = modelName;
  }

  async createEntity(model, resourceId) {
    await this.repository.createEntity({
      ...model,
      resourceId,
    });

    return this.repository.getAllByResourceId(resourceId);
  }

  async getEntities(id) {
    return this.repository.getAllByResourceId(id);
  }

  async updateEntity(salaryId, model) {
    const entity = await this.repository.getEntityById(salaryId);
    if (!entity) {
      throw new EntityNotFoundError(`Resource ${this.modelName}`, 'id', salaryId);
    }

    entity.updateModel(model);

    return this.repository.updateEntity(entity);
  }

  async deleteEntity(id) {
    const entity = await this.repository.getEntityById(id);
    if (!entity) {
      throw new EntityNotFoundError(`Resource ${this.modelName}`, 'id', id);
    }

    return this.repository.deleteEntity(entity);
  }
}

module.exports = BaseResourceCRUDHandler;
