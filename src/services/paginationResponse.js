function getPagination(pagination) {
    const { totalItems, currentPage, itemsOnPage } = pagination;
    const totalPages = Math.floor(totalItems / itemsOnPage);

    return {
        totalItems,
        totalPages: totalItems % itemsOnPage === 0 ? totalPages : totalPages + 1,
        currentPage,
    };
}
  
module.exports = getPagination;