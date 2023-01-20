const moment = require('moment');

async function getVacationSettingsResponse(vacation) {
  const result = vacation.toJSON();
  result.data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

  return result;
}

async function getVacationsSettingsResponse(vacations) {
  return Promise.all( vacations.map((vacation) => getVacationSettingsResponse(vacation)), );
}

async function getVacationResponse(vacation, isAmericanOffice) {
  const result = vacation.toJSON();

  if (isAmericanOffice) {
    // result.start = moment(result.start).tz('America/New_York');
    // result.end = moment(result.end).tz('America/New_York');
  }

  return result;
}

async function getVacationsResponse(vacations, isAmericanOffice) {
  return Promise.all(
    vacations.map((vacation) => getVacationResponse(vacation, isAmericanOffice)),
  );
}

module.exports = { getVacationsSettingsResponse, getVacationSettingsResponse,  getVacationsResponse, getVacationResponse, };