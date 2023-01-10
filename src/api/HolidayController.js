const ServicesFactory = require('../../services');
const { getHolidayResponses, getHolidayResponse } = require('../viewModels/holidayResponse')

async function getHolidays(req, res, next) {
  try {

    const holidayService = ServicesFactory.createHolidayService();
    const result = await holidayService.getHolidays(req.queryOptions);

    result.items = await getHolidayResponses(result.items);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getHoliday(req, res, next) {
  try {

    const holidayService = ServicesFactory.createHolidayService();
    const result = await holidayService.getHoliday(req.params.id);

    res.send(await getHolidayResponse(result));

  } catch (err) {
    next(err);
  }
}

async function createHoliday(req, res, next) {
  try {

    const holidayService = ServicesFactory.createHolidayService();
    const holiday = await holidayService.createHoliday(req.body);

    res.send(await getHolidayResponse(holiday));

  } catch (err) {
    next(err);
  }
}

async function updateHoliday(req, res, next) {
  try {

    const holidayService = ServicesFactory.createHolidayService();
    const holiday = await holidayService.updateHoliday(req.params.id, req.body);

    res.send(await getHolidayResponse(holiday));

  } catch (err) {
    next(err);
  }
}

async function deleteHoliday(req, res, next) {
  try {

    const holidayService = ServicesFactory.createHolidayService();
    const result = await holidayService.deleteHoliday(req.params.id);
    res.status(204).send(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { getHolidays, getHoliday, createHoliday, updateHoliday, deleteHoliday, };