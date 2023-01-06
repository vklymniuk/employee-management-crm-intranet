const defaults = {
    defaultSort: 'asc',
  };
  
  class QueryHelpers {
    static getFiltersFromQuery(query) {
      const result = [];
      Object.keys(query).forEach((key) => {
        if (key !== 'limit' && key !== 'page' && key !== 'sort') {
          const filter = {
            key,
            value: query[key] && query[key].indexOf(',') !== -1
              ? query[key].split(',')
              : query[key],
          };
          result.push(filter);
        }
      });
      return result;
    }
  
    static getPaginationFromQuery(query) {
      if (query.limit === 'all') {
        return {
          page: 1,
          limit: 0,
        };
      }
      const limitNum = Number(query.limit);
      const pageNum = Number(query.page);
      return {
        limit: limitNum || 10,
        page: pageNum || 1,
      };
    }
  
    static getSortFromQuery(query) {
      if (!query.sort) {
        return [];
      }
      return query.sort.split(',').map((item) => {
        const sortItem = item.split(':');
        const order = sortItem[1] || defaults.defaultSort;
        return {
          key: sortItem[0],
          order,
        };
      });
    }
  
    static getGroupingFromQuery(query) {
      if (!query.groupBy) {
        return null;
      }
      return query.groupBy;
    }
  }
  
  module.exports = QueryHelpers;
  