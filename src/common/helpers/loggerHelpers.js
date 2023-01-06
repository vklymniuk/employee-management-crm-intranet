const { LOG_ACTIONS } = require('../consts');

class LoggerHelpers {
  static init(userId, actionLogService) {
      this.actionLogService = actionLogService;
      this.userId = userId;
      this.hooks = [
          {
            type: 'afterCreate',
            action: LOG_ACTIONS.CREATED,
          },
          {
            type: 'afterBulkCreate',
            action: LOG_ACTIONS.BULK_CREATED,
          },
          {
            type: 'afterUpdate',
            action: LOG_ACTIONS.UPDATED,
          },
          {
            type: 'afterBulkUpdate',
            action: LOG_ACTIONS.BULK_UPDATED,
          },
          {
            type: 'afterDestroy',
            action: LOG_ACTIONS.DELETED,
          },
          {
            type: 'afterBulkDestroy',
            action: LOG_ACTIONS.BULK_DELETED,
          },
      ];

    return this;
  }

  // Saving all logs to database
  static async save(config, instance) {
    this.actionLogService.processing({...config, userId: this.userId, }, instance);
  }

  // Remove hook from model
  static destroyHook(model, hook) {
    model.removeHook(hook.type, hook.type);
  }

  // Add hook to model. Before adding, need to remove to avoid collision
  static applyHook(model, hook, config) {
    this.destroyHook(model, hook);
    const hookConfig = {
      action: hook.action,
      modelName: model.name || 'unknown',
      ...config,
    };
    model.addHook(hook.type, hook.type, this.save.bind(this, hookConfig));

  }

  // Run logger
  static run(model, config) {
    this.hooks.forEach((hook) => this.applyHook(model, hook, config));
  }
}

module.exports = LoggerHelpers;