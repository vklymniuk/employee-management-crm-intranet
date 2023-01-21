const ActionLogHandler = require('../handlers/actionLogHandler');

class ActionLogService extends ActionLogHandler {
  async processing(config, instance) {
    const log = super.processing(config, instance);

    if (log) {
      await this.createLog(log);
    }
  }

  async createLog(model) {
    return this.actionLogRepository.createEntity(model);
  }

  async getAll({ filters, sorters, pagination } = {}) {
    return this.actionLogRepository.getAll({ filters, sorters, pagination, });
  }

  async getLog(id) {
    return this.actionLogRepository.getEntityById(id);
  }
}

module.exports = ActionLogService;