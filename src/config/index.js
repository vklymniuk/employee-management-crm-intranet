require('dotenv').config();
const path = require('path');
const appsettings = require('./appsettings.json');
const logger = require('../logger');
const { Helpers, FileHelpers } = require('../common/helpers');
const { version: appVersion } = require('../../package.json');

let config = appsettings;
const { defaults } = config;
const env = (process.env.NODE_ENV || defaults.env).toLowerCase();
const apiPort = process.env.API_PORT || defaults.port;
const rootPath = path.resolve(__dirname, '../../');
const envConfigPath = path.resolve(__dirname, `appsettings.${env}.json`);

try {

  if (FileHelpers.existsSync(envConfigPath)) {
    const fileData = FileHelpers.readSync(envConfigPath);
    const json = JSON.parse(fileData);
    config = Helpers.deepMerge(config, json);
  }

} catch (err) {
  logger.logError(err);
}

module.exports = {
  config,
  appVersion,
  env: {
    ...process.env,
    NODE_ENV: env,
    API_PORT: apiPort,
    ROOT_PATH: rootPath,
  },
};