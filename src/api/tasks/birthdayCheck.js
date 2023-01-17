const { RepositoriesFactory } = require('../../db');
const ServicesFactory = require('../../services');
const { EmailsFactory } = require('../factories/emailsFactory');
const { DateHelpers } = require('../../common/helpers');
const { ROLES } = require('../../common/consts');

const toAll = [ROLES.EXECUTIVE];

async function birthdayCheck() {
  const resourceRepository = RepositoriesFactory.createResourceRepository();
  const smtp = ServicesFactory.createSmtpService();
  const resources = await resourceRepository.getAll();

  const isResourceOfOffice = (resource, locationId, role) => {
    if (resource.resourceRole && resource.resourceRole.title === role) {
      return resource.locationId === locationId;
    }
    return false;
  };

  const isMatchRole = (resource, role) => {
    return resource.resourceRole && resource.resourceRole.title === role;
  };

  resources.items.forEach((x) => {
    if (!x.birthday) {
      return;
    }
    const isBirthday = DateHelpers.isBirthdayToday(x.birthday);
    if (isBirthday) {
      const recipients = resources.items.filter((resource) => (
        isResourceOfOffice(resource, x.locationId, ROLES.HR)
        || isResourceOfOffice(resource, x.locationId, ROLES.ADMIN)
        || (isMatchRole(resource, ROLES.QA) && isMatchRole(resource, ROLES.QAL))
        || toAll.includes(resource.resourceRole.title.toUpperCase())
      ));

      const emailList = recipients.map((r) => r.email);
      const email = EmailsFactory.createBirthdayEmail(x, emailList);
      if (email) {
        smtp.sendEmail(email);
      }
    }
  });
}

module.exports = birthdayCheck;