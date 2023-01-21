const GoogleOAuthProvider = require('./googleOAuthProvider');
const { config } = require('../../config');

/**
 * @class
 * @public
 */
class ProvidersFactory {

  constructor(settings) {
    this.settings = settings;
  }

  createOAuthProvider() {
    return new GoogleOAuthProvider(this.settings.oAuth);
  }

  createCalendarAuthProvider() {
    return new GoogleOAuthProvider(this.settings.calendarOAuthConfig);
  }
}

/**
 * @class
 */
module.exports = new ProvidersFactory(config);