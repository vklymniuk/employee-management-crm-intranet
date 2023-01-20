const { RepositoriesFactory } = require('../../db');
const ServicesFactory = require('../../services');
const { EmailsFactory } = require('../factories');
const { DateHelpers } = require('../../common/helpers');
const { DbHelpers } = require('../../db/helpers');
const { ROLES, COMMON: { DATE_BEFORE_TYPE, CONTRACT_EXPIRATION_TYPE }, } = require('../../common/consts');
const toAll = [ROLES.CEO, ROLES.DIR_OP];

async function contractExpirationDate() {
  const empRepository = RepositoriesFactory.createResourceRepository();
  const smtp = ServicesFactory.createSmtpService();
  const resources = await empRepository.getAll({ filters: [] });

  resources.items.forEach((x) => {
    if (!x.contractEndDate) return;

    const oneMonthBefore = DateHelpers.isDateBefore(x.contractEndDate, DATE_BEFORE_TYPE.MONTH);
    const oneWeekBefore = DateHelpers.isDateBefore(x.contractEndDate, DATE_BEFORE_TYPE.WEEK);

    if (oneMonthBefore || oneWeekBefore) {
      const recipients = resources.items.filter((emp) => (
        DbHelpers.isResourceOfOffice(emp, x.locationId, ROLES.HR)
        || DbHelpers.isResourceOfOffice(emp, x.locationId, ROLES.ADMIN)
        || toAll.includes(emp.resourceRole.title.toUpperCase())
      ));

      const emailList = recipients.map((r) => r.email);

      const email = oneMonthBefore
        ? EmailsFactory.createContractExpiration(x, emailList)
        : EmailsFactory.createContractExpiration(x, emailList, CONTRACT_EXPIRATION_TYPE.WEEK);

      if (email) {
        smtp.sendEmail(email);
      }

    }
  });
}

module.exports = contractExpirationDate;