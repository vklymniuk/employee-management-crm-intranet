const Sequelize = require('sequelize');
const op = Sequelize.Op;

class DbHelpers {

  /**
   * Check if the resource location equals with the passed location
   * @param resource
   * @param locationId
   * @param role
   * @returns {boolean}
   */
  static isResourceOfOffice(resource, locationId, role) {
    if (resource.resourceRole && resource.resourceRole.title === role) {
      return resource.locationId === locationId;
    }
    return false;
  }

  static isContainWhitespace(string) {
    return /\s/g.test(string);
  }

  static getSortingByName(value) {
    const [firstName, lastName] = value.split(/\s+/);
    return {
      whereOp: op.and,
      condition: [
        {
          firstName: {
            [op.or]: [
              { [op.like]: `%${firstName}%` },
              { [op.like]: `%${lastName}%` },
            ],
          },
        },
        {
          lastName: {
            [op.or]: [
              { [op.like]: `%${firstName}%` },
              { [op.like]: `%${lastName}%` },
            ],
          },
        },
      ],
    };
  }
}

module.exports = DbHelpers;
