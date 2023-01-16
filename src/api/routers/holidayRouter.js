const router = require('express').Router();
const { validate } = require('express-validation');
const { HolidayController } = require('../controllers');
const { queryOptionsMiddleware } = require('../middlewares');
const commonValidator = require('../schemas/common');
const holidayValidator = require('../schemas/holiday');

router.get('/', queryOptionsMiddleware, HolidayController.getHolidays);
router.get('/:id', HolidayController.getHoliday);
router.post('/', validate(holidayValidator.create), HolidayController.createHoliday,);
router.put('/:id', validate(holidayValidator.update), HolidayController.updateHoliday,);
router.delete('/:id', validate(commonValidator.deleteReq), HolidayController.deleteHoliday,);
module.exports = router;