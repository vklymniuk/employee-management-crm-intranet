const { Helpers } = require('../../common/helpers');
const { LOG_ACTIONS } = require('../../common/consts');

class ActionLogHandler {
  constructor(actionLogRepository) {
    this.actionLogRepository = actionLogRepository;
  }

  /* Create and Delete Action Handler */
  createAndDeleteAction(baseLog, instance) {
    const { actionType } = baseLog;

    return {
      ...baseLog,
      ...baseLog.changes,
      ...(actionType === LOG_ACTIONS.CREATED && { newData: instance.toJSON() || null }),
      ...(actionType === LOG_ACTIONS.BULK_CREATED && { newData: instance[0].toJSON() || null }),
      ...(actionType === LOG_ACTIONS.DELETED && { oldData: instance.toJSON() || null }),
      ...(actionType === LOG_ACTIONS.BULK_DELETED && { oldData: instance.where || null }),
    };
  }

  /* Update Action Handler */
  updateAction(baseLog, instance) {
    const entityId = (instance && instance.id) || 0;
    const changes = Helpers.sequelizeChanges(instance);
    const oldData = Helpers.sequelizePrevInstance(instance, changes) || null;
    const newData = Helpers.sequelizeCurrInstance(instance, changes) || null;

    const other = {};
    const parsedInstance = instance.toJSON();
    Object.keys(parsedInstance).forEach((i) => {
      if (i.toLowerCase().endsWith('id')) {
        other[i] = parsedInstance[i];
      }
    });

    return {
      ...baseLog,
      entityId,
      oldData,
      newData,
      changes,
      other,
    };
  }

  processing(config, instance) {
    const {
      action: actionType,
      modelName: entityType,
      userId,
      skipActionLog = false,
    } = config;

    if (entityType === 'actionLog') return null;
    if (skipActionLog) return null;

    const baseLog = {
      actionType,
      entityType,
      entityId: (instance && instance.id) || null,
      userId,
      oldData: null,
      newData: null,
      changes: null,
      other: null,
    };

    switch (actionType) {
      case LOG_ACTIONS.CREATED:
      case LOG_ACTIONS.DELETED:
      case LOG_ACTIONS.BULK_CREATED:
      case LOG_ACTIONS.BULK_DELETED:
      {
        return this.createAndDeleteAction(baseLog, instance);
      }
      case LOG_ACTIONS.UPDATED: {
        return this.updateAction(baseLog, instance);
      }
      case LOG_ACTIONS.BULK_UPDATED: {
        console.log('Bulk updated', instance);
        break;
      }
      default:
        break;
    }

    return baseLog;
  }
}

module.exports = ActionLogHandler;