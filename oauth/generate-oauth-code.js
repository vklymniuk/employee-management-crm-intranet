const fs = require('fs');
const { google } = require('googleapis');
const { config: configuration } = require('../src/config');

const { OAuth2 } = google.auth;

/**
 * Receiving config key from arguments
 * @type {string}
 */
const configKey = process.argv[process.argv.length - 2];

/**
 * If passed key not in configuration return error
 */
if (!configuration.hasOwnProperty(configKey)) {
  return console.error('The passed key doesn\'t exists in the configuration');
}

/**
 * Receiving code from arguments
 * @type {string}
 */
const code = process.argv[process.argv.length - 1];

/**
 * Getting an object from the configuration by the passed key
 */
const config = configuration[configKey];

if (code.includes('oauth-code')) {
  console.error('Please enter code');
} else {
  console.log(`\nYou entered this code: ${code} \n`);

  /* Create instance of OAuth2 to generate token*/
  const client = new OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );

  /**
   * Generating token from received code and saving to file
   */
  client.getToken(code, (err, token) => {
    if (err) {
      return console.error('Error:', err.message);
    }

    console.log(`Token successfully created`);
    console.log(`Location: ${config.tokenFilePath}`);

    /**
     * Writing the generated token to a file.
     * File path obtained from config
     */
    fs.writeFileSync(config.tokenFilePath, JSON.stringify(token, null, 2));
  });
}