class ExternalPaginationHelpers {
    static getPagination(data, options, resultKey = 'items') {
      // If data is not array, pagination cannot work
      if (!Array.isArray(data)) {
          return null;
      }
  
      // Getting limit and page from query options
      const { limit: pageSize, page: currentPage } = options;
  
      // Calculate total items
      const totalItems = data.length;
  
      // Calculate total pages
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Creating data to return from function
      let paginatedData = [];
  
      // Return paginated data if limit != all or 0
      if (pageSize !== 0) {
        paginatedData = data
          .slice((currentPage - 1) * pageSize)
          .slice(0, pageSize);
      } else {
          paginatedData = data;
      }
  
      return {
        pagination: { totalItems, totalPages, currentPage, },
        [resultKey]: paginatedData,
      };
    }
}

module.exports = ExternalPaginationHelpers;