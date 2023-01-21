const { VACANCY_STATUSES } = require('../../common/consts');

class FutureProjectHandler {
  getVacancyStatus(approved = false, resourceId = null) {
    let vacancyStatusId = VACANCY_STATUSES.INITIAL;

    if (approved && resourceId) {
      vacancyStatusId = VACANCY_STATUSES.APPROVED;
    } else if (!approved && resourceId) {
      vacancyStatusId = VACANCY_STATUSES.POTENTIAL;
    }

    return vacancyStatusId;
  }
}

module.exports = FutureProjectHandler;