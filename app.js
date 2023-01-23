const express = require('express');
const { db } = require('./src/db');
const registerAPI = require('./src/api');
const { config, env } = require('./src/config');
const { FileHelpers } = require('./src/common/helpers');
const registerTasks = require('./src/api/tasks');

const app = express();

registerAPI(app);

db.sequelize.sync().then(() => {
  registerTasks().then(() => {
    FileHelpers
      .checkStaticFileFolders(
        env.ROOT_PATH,
        config.filePath.staticFiles,
        config.filePath.folders,
      ).then(() => app.listen(env.API_PORT));
  });
});