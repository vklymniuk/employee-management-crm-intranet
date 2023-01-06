const moment = require('moment');
const dayjs = require('dayjs');
const { COMMON: { DATE_BEFORE_TYPE } } = require('../consts');

class DateHelpers {
  static getCurrentUtc() {
    return moment.utc();
  }

  static getDatesDiff(startDate, endDate) {
    const start = moment.isMoment(startDate) ? startDate : moment(startDate);
    const end = moment.isMoment(endDate) ? endDate : moment(endDate);
    return moment.duration(end.diff(start));
  }

  static isBirthdayToday(birthday) {
    const currentDate = moment.utc();
    return currentDate.isSame(birthday, 'day') && currentDate.isSame(birthday, 'month');
  }

  static getCurrentUATime() {
    return moment.tz('Europe/Kiev');
  }

  /**
   * Check if date is in the current month
   * @param date
   * @returns {boolean}
   */
  static isDateInCurrentMonth(date) {
    const now = new Date();
    const dt = new Date(date);

    return ((dt > now)
      && (now.getMonth() === dt.getMonth())
      && (now.getFullYear() === dt.getFullYear())
    );
  }

  /**
   * Calculate how many days are left until the date
   * @param start
   * @param end
   * @returns {number}
   */
  static amountOfDaysInDate(start, end) {
    let startDate = new Date();
    const endDate = arguments.length === 1 ? new Date(start) : new Date(end);

    let difference;
    if (arguments.length === 2) {
      startDate = new Date(start);
      difference = endDate.getTime() - startDate.getTime();
    } else {
      if (endDate.getTime() < startDate.getTime()) {
        return 0;
      }

      difference = endDate.getTime() - startDate.getTime();
    }
    return (Math.ceil(difference / (1000 * 3600 * 24))) || 0;
  }

  /**
   * To check if start date not less than end date
   * @param start
   * @param end
   * @returns {boolean}
   */
  static isValidDates(start, end) {
    return new Date(end) >= new Date(start);
  }

  /**
   * Check if a date is within the specified date range
   * @param start
   * @param end
   * @param date
   * @returns {boolean}
   */
  static isDateInYear(start, end, date) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dt = new Date(date);

    return dt > startDate && dt < endDate;
  }

  /**
   * Comparing two dates
   * @param d1
   * @param d2
   * @returns {boolean}
   */
  static compareDate(d1, d2) {
    return new Date(d1).toUTCString() === new Date(d2).toUTCString();
  }

  static isDateBefore(date, type, today = null) {
    const now = today ? dayjs(new Date(today)) : dayjs();
    const target = dayjs(date);

    switch (type) {
      case DATE_BEFORE_TYPE.MONTH: {
        const result = now.add(1, 'month');
        return dayjs(result).isSame(target, 'date');
      }
      case DATE_BEFORE_TYPE.WEEK: {
        const result = now.add(1, 'week');
        return dayjs(result).isSame(target, 'date');
      }
      default:
        return false;
    }
  }

  static isDateAfter(date, now = this.getCurrentUtc()) {
    return moment(date).isAfter(now);
  }

  /**
   * Get month number from the date
   * @param date
   */
  static getMonth(date) {
    return new Date(date).getMonth() + 1;
  }

  /**
   * Count how many weekends between two dates
   * @param start
   * @param end
   */
  static countWeekends(start, end) {
    const fromDate = new Date(start);
    const toDate = new Date(end);
    let weekendDayCount = 0;

    while (fromDate <= toDate) {
      if (fromDate.getDay() === 0 || fromDate.getDay() === 6) {
        weekendDayCount += 1;
      }
      fromDate.setDate(fromDate.getDate() + 1);
    }

    return weekendDayCount;
  }

  /**
   * Count how many holidays between two dates
   * @param start
   * @param end
   * @param holidays, IMPORTANT!!!
   * Holidays must be the array and in the followed format:
   * [ { day: 1, month: 1 }, ...]
   */
  static countHolidays(start, end, holidays) {
    const fromDate = new Date(start);
    const toDate = new Date(end);
    let holidaysCount = 0;

    while (fromDate < toDate) {
      const isHoliday = holidays.some(
        (holiday) => holiday.day === fromDate.getDate()
          && holiday.month === (fromDate.getMonth() + 1),
      );
      if (isHoliday) holidaysCount += 1;
      fromDate.setDate(fromDate.getDate() + 1);
    }

    return holidaysCount;
  }

  /**
   * Check if the date falls within the date range
   * @param start
   * @param end
   * @param date
   */
  static isDateInRange(start, end, date) {
    const a = new Date(start);
    const b = new Date(end);
    const target = new Date(date);

    return target >= a && target <= b;
  }
}

module.exports = DateHelpers;
