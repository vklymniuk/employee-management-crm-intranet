class PaginationHelpers {
  static getPagination(result, pagination) {
    const totalItems = result.count;
    const currentPage = pagination ? pagination.page : 1;
    const itemsOnPage = pagination ? pagination.limit : result.items.length;
    const totalPages = Math.floor(totalItems / itemsOnPage);
    return {
      totalItems,
      totalPages: totalItems % itemsOnPage === 0 ? totalPages : totalPages + 1,
      currentPage,
    };
  }
}

module.exports = PaginationHelpers;
