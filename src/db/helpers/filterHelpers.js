class FilterHelpers {
  static getFilters(filters = [], entityFilters = []) {
    const result = {
      include: [],
      where: {},
    };
    filters
      .map((x) => ({
        ...x,
        value: typeof x.value === 'string' ? x.value.trim() : x.value,
      }))
      .forEach((filter) => {
        const entityFilter = (entityFilters !== null) ? entityFilters[filter.key] : null;
        if (entityFilter) {
          const filterObj = entityFilter(filter.value);
          if (filterObj.include) {
            result.include.push(filterObj.include);
          } else if (filterObj.whereOp) {
            result.where[filterObj.whereOp] = Array.isArray(result.where[filterObj.whereOp])
              ? result.where[filterObj.whereOp].concat(filterObj.condition)
              : filterObj.condition;
          } else {
            result.where[filterObj.entityKey] = filterObj.condition;
          }
        }
      });

    return result;
  }
}

module.exports = FilterHelpers;
