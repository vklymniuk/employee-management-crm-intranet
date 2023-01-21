const { Helpers } = require('../../common/helpers');

class ServiceHandler {
  constructor(repositories, services) {
    if (repositories) {
        this.parseObjects(repositories);
    }

    if (services) {
        this.parseObjects(services);
    }
  }

  parseObjects(arr) {
    arr.forEach((obj) => {
      const { name: className } = obj.constructor;
      const name = Helpers.toLowerCaseFirstLetter(className);
      this[name] = obj;

      if (name !== 'object') {
        this[name] = obj;
      } else if (obj.name) {
        this[obj.name] = obj.source;
      } else {
        throw new Error('If you specified an source then the name must be present');
      }
    });
  }
}

module.exports = ServiceHandler;