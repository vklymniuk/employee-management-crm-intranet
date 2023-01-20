const RepositoryFactory = require('../../db/repositories');
const { Helpers } = require('../../common/helpers');

async function actionLogRelations(result) {
  const { oldData, newData, } = result;

  const removeId = (str) => str.toLowerCase().substring(0, str.length - 2);
  const endWithId = (str) => str.toLowerCase().includes('id');
  const computedRepositoryName = (core) => `create${Helpers.capitalize(core)}Repository`;

  const key = oldData || newData;

  if (key) {
    const arr = Object.keys(key).map(async (field) => {

      if (endWithId(field) && field !== 'id') {
        const formattedField = removeId(field);
        const id = key[field];

        const repositoryName = computedRepositoryName(formattedField);

        if (RepositoryFactory[repositoryName]) {
          const repository = RepositoryFactory[repositoryName]();

          if (!Array.isArray(id)) {
            const nId = Number(id) || 0;

            if (nId) {
              const entity = await repository.getEntityById(id);

              return { field: formattedField, data: entity?.toJSON() || null, };
            }

            return null;
          }

          const datas = await Promise.all(
            id.map(async (item) => {
              const entity = await repository.getEntityById(item);

              return entity?.toJSON() || null;
            }),
          );

          return { field: formattedField, data: datas, };
        }
      }

      return null;
    });

    (await Promise.all(arr)).forEach((item) => {
      if (item) {
        key[item.field] = item.data;
      }
    });
  }

  return { oldData, newData,};
}

async function getActionLogResponse(resource) {
  const result = resource.toJSON();

  const { oldData, newData, other, changes, } = result;
  result.oldData = typeof oldData === 'string' ? JSON.parse(oldData) : oldData;
  result.newData = typeof newData === 'string' ? JSON.parse(newData) : newData;
  result.other = typeof other === 'string' ? JSON.parse(other) : other;
  result.changes = typeof changes === 'string' ? JSON.parse(changes) : changes;

  const logRelation = await actionLogRelations(result);

  result.oldData = logRelation.oldData;
  result.newData = logRelation.newData;

  return result;
}

async function getActionLogsResponse(actionLogs) {
  return Promise.all(actionLogs.map((log) => getActionLogResponse(log)));
}

module.exports = { getActionLogResponse, getActionLogsResponse, };