const { config } = require('../../config');

class LinksFactory {
  static createVacationLink(vacationId) {
    const defaultDomain = 'http://google.com/';
    const domain = config.frontPaths.frontRootUrl || defaultDomain;
    const vacationPath = config.frontPaths.vacation;

    return `${domain}${vacationPath}/${vacationId}`;
  }
}

module.exports = LinksFactory;