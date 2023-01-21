const { google } = require('googleapis');
const { InternalServerError } = require('../../common/errors');
const { FileHelpers } = require('../../common/helpers');
const { OAuth2 } = google.auth;

/**
 * In future, if project will use more Google API for one account
 * (means one google account),
 * add type for this class, to determine path of token
 */
class GoogleOAuthProvider {
  constructor(config) {
    this.config = config;
    this.scopes = this.config.scopes;
    this.client = new OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri,
    );
    this.tokenFilePath = config.tokenFilePath;
  }

  /**
   * Old function to get tokens`
   * @returns {Promise<Credentials>}
   */
  async getTokens() {

    if (await FileHelpers.exists(this.tokenFilePath)) {
      const data = await FileHelpers.read(this.tokenFilePath);
      let token = JSON.parse(data);
      this.client.setCredentials({ refresh_token: token.refresh_token });
      token = (await this.client.refreshAccessToken()).credentials;
      await FileHelpers.write(this.tokenFilePath, JSON.stringify(token));

      return token;
    }

    throw new InternalServerError('Generate your first refresh token');
  }

  /**
   * Getting google client from OAuth using refreshToken
   * @returns {Promise<OAuth2Client>}
   */
  async getAuthClient() {
    if (await FileHelpers.exists(this.tokenFilePath)) {
      // Getting data from generated tokens file
      const data = await FileHelpers.read(this.tokenFilePath);
      // Parsing data from json
      let token = JSON.parse(data);
      // Getting refresh token from file
      const { refresh_token: refreshToken } = JSON.parse(data);
      // Set credentials to use via refresh token
      this.client.setCredentials({ refresh_token: refreshToken });
      // Refresh access token
      token = (await this.client.refreshAccessToken()).credentials;
      // Save new token
      await FileHelpers.write(this.tokenFilePath, JSON.stringify(token));

      return this.client;
    }

    throw new InternalServerError('Generate your first refresh token');
  }
}

module.exports = GoogleOAuthProvider;