const ServicesFactory = require('../../services');
const {
  getVacationsSettingsResponse,
  getVacationSettingsResponse,
} = require('../viewModels/vacationResponse');

async function getAllSettings(req, res, next) {
  try {

    const settingsService = ServicesFactory.createVacationSettingsService();
    const result = await settingsService.getAllSettings();
    result.items = await getVacationsSettingsResponse(result.items);
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function getSettingsByKey(req, res, next) {
  try {

    const settingsService = ServicesFactory.createVacationSettingsService();
    const result = await settingsService.getSettingByKey(req.params.key);
    res.send(await getVacationSettingsResponse(result));

  } catch (err) {
    next(err);
  }
}

async function updateVacationRecipientEmail(req, res, next) {
  try {

    const settingsService = ServicesFactory.createVacationSettingsService();
    const result = await settingsService.updateVacationRecipientEmail(req.body);
    res.send(await getVacationSettingsResponse(result));

  } catch (err) {
    next(err);
  }
}

module.exports = { getAllSettings, getSettingsByKey, updateVacationRecipientEmail, };