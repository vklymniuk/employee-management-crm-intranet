const ModelsFactory = require('./factories/modelsFactory');
const RepositoriesFactory = require('./repositories');
const db = require('./models');

module.exports = {
  ModelsFactory,
  RepositoriesFactory,
  db,
};
