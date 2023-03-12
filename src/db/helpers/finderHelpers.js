class FinderHelpers {
  static async findResourceByName(resourceRepository, value) {
    const resources = await resourceRepository.getAll({
      filters: [
        {
          key: 'name',
          value,
        }],
    });
    return resources.items[0];
  }
}

module.exports = FinderHelpers;
