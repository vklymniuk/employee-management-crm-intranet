const { google } = require('googleapis');
const { config: configuration } = require('../src/config');
const { OAuth2 } = google.auth;

/**
 * Pass the config key from configuration as an argument when running this file
 * Example: node retrive-oauth-uri.js <config key>
 *
 * Configuration file located: src/config/appsettings.json
 * Production configuration file is located: src/config/appsettings.production.json
 * @type {string}
 */
const configKey = process.argv[process.argv.length - 1];

/**
 * If passed key not in configuration return error
 */
if (!configuration.hasOwnProperty(configKey)) {
  return console.error('The passed key doesn\'t exists in the configuration');
}

/**
 * Getting an object from the configuration by the passed key
 */
const config = configuration[configKey];

/**
 * Create OAuth client from config data
 * Need to provide next fields:
 *    -clientId
 *    -clientSecret
 *    -redirectUri
 *  These variables are obtained from the passed config
 *
 *  If you create new google account, and want to use it as API for app
 *  You need to create OAuth Client ID with the application type: Desktop App
 *  You can do it on this page: https://console.developers.google.com/
 *
 *  After creating OAuth credentials, you will receive these variables:
 *      -clientId
 *      -clientSecret
 *  Write them to the config file, pass the following line as redirectUri
 *      - urn:ietf:wg:oauth:2.0:oob
 * @type {OAuth2Client}
 */
const client = new OAuth2(config.clientId, config.clientSecret, config.redirectUri,);

/**
 * Generate a link for auth via google to allow access to the api
 *
 * The link that you get as a result of this function will return
 * you a code that you need to insert into another file to generate a token
 * @type {string}
 */
const authUrl = client.generateAuthUrl({
  access_type: config.accessType,
  scope: config.scopes,
});

console.log('\nGo to this URI and give the access for app:');
console.log(authUrl);
console.log('\nThen copy code and run `node oauth/generate-oauth-token.js <config> <code>`');