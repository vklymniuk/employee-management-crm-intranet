const Sequelize = require('sequelize');
const { SorterError } = require('../errors');
const { COMMON } = require('../../common/consts');
const { col, fn } = Sequelize;
const { SQL } = COMMON;

class SorterHelpers {
  static getSorters(sorters = [], entitySorters = {}, model) {
    if (!model) {
      throw new SorterError('model argument required');
    }
    const result = {
      include: [],
      order: [],
    };
    const entityFields = model.fieldRawAttributesMap;
    const entityKeys = Object.keys(entityFields)
      .map((field) => entityFields[field].fieldName);

    if (sorters.length > 0) {
      sorters.forEach((sorter) => {
        const entitySorter = (entitySorters !== null) ? entitySorters[sorter.key] : null;
        if (entitySorter) {
          const orderObj = entitySorter(sorter.order);
          if (orderObj.include) {
            result.include.push(orderObj.include);
          }
          orderObj.orders.forEach((order) => result.order.push(order));
        } else if (entityKeys.includes(sorter.key)) {
          result.order.push([fn(SQL.FUNC.ISNULL, col(`${model.name}.${sorter.key}`))]);
          result.order.push([sorter.key, sorter.order]);
        }
      });
    }
    return result;
  }
}

module.exports = SorterHelpers;
