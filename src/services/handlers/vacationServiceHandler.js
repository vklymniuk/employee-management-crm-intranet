const moment = require('moment');
const { EmailsFactory, LinksFactory } = require('../../api/factories');
const { ValidationError, EntityNotFoundError } = require('../../common/errors');
const {
  DateHelpers, Helpers,
} = require('../../common/helpers');
const ServiceHandler = require('./serviceHandler');
const { DbHelpers } = require('../../db/helpers');
const {
  VACATION_TYPES, COMMON, ROLES, VACATION_FIELDS, VACATION_STATUSES, SETTINGS_KEYS,
} = require('../../common/consts');

class VacationServiceHandler extends ServiceHandler {
  /**
   * Set resource object for manipulations
   * @param resource
   */
  setResource(resource) {
    this.resource = resource;
    this.resourceLocationId = resource.locationId;
  }

  /**
   * Whether vacation is created within the resource's contract term
   * @param vacation
   * @param resource
   * @returns {boolean}
   */
  isVacationInContractDate(vacation, resource) {
    if (!resource?.resourceContracts?.length) {
      return false;
    }

    const startDate = resource?.resourceContracts[0]?.startDate;
    const endDate = resource?.resourceContracts[0]?.endDate;
    const d1 = DateHelpers.isDateInYear(startDate, endDate, vacation.start);
    const d2 = DateHelpers.isDateInYear(startDate, endDate, vacation.end);

    return d1 || d2;
  }

  /**
   * To check if start date not less than end date
   * @param start
   * @param end
   * @returns {boolean}
   */
  isValidDates(start, end) {
    return DateHelpers.isValidDates(start, end);
  }

  /**
   * Get the duration of vacation. Means the number of days from the start date of vacation
   * to end the date
   * @param start
   * @param end
   * @returns {number}
   */
  async getVacationLength(start, end) {
    const amountDays = DateHelpers.amountOfDaysInDate(start, end) + 1;
    const holidays = await this.countHolidays(start, end);
    const weekends = await this.countWeekends(start, end);

    return amountDays - (holidays + weekends); // exclude weekends and holidays
  }

  /**
   * Check if the resource has enough vacation days
   * @param availableDays
   * @param vacationLength
   * @returns {boolean}
   */
  isResourceHasEnoughDays(availableDays, vacationLength) {
    return availableDays >= vacationLength;
  }

  getResourceField(vacationType) {
    const field = vacationType === VACATION_TYPES.PAID
      ? VACATION_FIELDS.PAID_FIELD
      : VACATION_FIELDS.UNPAID_FIELD;

    return field;
  }

  /**
   * A function that gets the resource's remaining vacation days by specific field
   * and checks if the resource has enough days to create a vacation
   * @param vacation
   * @param resource
   * @returns {Promise<boolean>}
   */
  async checkResourceDays(vacation, resource) {
    const { start, end, } = vacation;
    const vacationLength = await this.getVacationLength(start, end);
    const resourceField = this.getResourceField(vacation.type);
    const availableDays = resource[resourceField];
    const isResourceHasEnoughDays = this.isResourceHasEnoughDays(availableDays, vacationLength);

    if (isResourceHasEnoughDays) {
      return true;
    }

    throw new ValidationError('Resource does not have enough vacation days');
  }

  /**
   * Checking the vacation for validation before doing something
   * @param vacation
   * @param resource
   * @returns {boolean}
   */
  async isValidVacation(vacation, resource) {
    if (this.isValidDates(vacation.start, vacation.end)) {

      if (this.isVacationInContractDate(vacation, resource)) {
        return true;
      }

      throw new ValidationError('The assigned vacation does not correspond to the contract period');
    } else {
      throw new ValidationError('Start date cannot be less than end date');
    }
  }

  /**
   * Preparing object to send to google calendar
   * @param vacation
   * @param resource
   * 
   * @returns {{ Object }}}
   */
  prepareVacationForGoogle(vacation, resource) {
    return {
      summary: `${resource.firstName} ${resource.lastName} - ${Helpers.capitalize(vacation.type)}`,
      description: vacation.description,
      start: { date: moment(vacation.start).format('YYYY-MM-DD'), },
      end: { date: moment(vacation.end).add({ days: 1 }).format('YYYY-MM-DD'), },
    };
  }

  /**
   * Create vacation on google calendar
   * @param vacation
   * @param resource
   * @returns {Promise<*>} vacation object
   */
  async createVacationOnGoogle(vacation, resource) {
    const newVacation = { ...vacation };
    // Google event object
    const event = this.prepareVacationForGoogle(vacation, resource);
    const calendarEvent = await this.googleCalendarService.createEvent(event);
    newVacation.synced = false;

    if (calendarEvent) {
      const { id, htmlLink, } = calendarEvent.data;
      newVacation.synced = true;
      newVacation.gcalendarId = id;
      newVacation.eventLink = htmlLink;
    }

    return newVacation;
  }

  /**
   * Delete vacation from the google calendar and return new vacation data
   * @param vacationEntity
   * @returns {Promise<{gcalendarId: null, synced: null, eventLink: null}>}
   */
  async deleteVacationFromGoogle(vacationEntity) {
    const event = await this.googleCalendarService.getEvent(vacationEntity.gcalendarId);

    if (event.data.status !== 'cancelled') {
      await this.googleCalendarService.deleteEvent(vacationEntity.gcalendarId);

      return { gcalendarId: null, eventLink: null, synced: null, };
    }

    return null;
  }

  /**
   * Count the number of days in the vacation created
   * @param availableDays
   * @param startDate
   * @param endDate
   */
  async countVacationDaysLeft(availableDays, startDate, endDate) {
    const vacationLength = await this.getVacationLength(startDate, endDate);

    return availableDays - vacationLength;
  }

  /**
   * Recalculating remaining vacation days when CREATE vacation
   * @param baseObj
   * @param vacation
   * @param resource
   * 
   * @returns {{newType: boolean, value: *}}
   */
  async vacationCreateRecalculating(baseObj, vacation, resource) {
    const daysLeft = await this.countVacationDaysLeft(resource[baseObj.key], vacation.start,
      vacation.end);

    return { ...baseObj, newType: false, value: daysLeft, };
  }

  /**
   * Recalculating remaining vacation days when UPDATE vacation
   * @param baseObj
   * @param vacation
   * @param resource
   * @returns
   * {*|{value: (number|*)}|{paidVacationDaysLeft: *, newType: boolean, unpaidVacationDaysLeft: *}}
   */
  async vacationUpdateRecalculating(baseObj, vacation, resource) {
    /* If type was changed, need to move days for previous type to new type */
    if (vacation.changed('type')) {
      /* Count remaining vacation days */
      const daysLeft = await this.countVacationDaysLeft(resource[baseObj.key], vacation.start,
        vacation.end);
      /* Count days in vacation */
      const prevDays = await this.getVacationLength(vacation.previous('start'),
        vacation.previous('end'));

      if (vacation.type === VACATION_TYPES.PAID) {
        return {
          ...baseObj,
          paidVacationDaysLeft: this.isResourceHasEnoughDays(resource.paidVacationDaysLeft,
            daysLeft) && daysLeft,
          unpaidVacationDaysLeft: resource.unpaidVacationDaysLeft + prevDays,
          newType: true,
        };
      }

      if (vacation.type === VACATION_TYPES.UNPAID) {
        return {
          ...baseObj,
          paidVacationDaysLeft: resource.paidVacationDaysLeft + prevDays,
          unpaidVacationDaysLeft: this.isResourceHasEnoughDays(resource.unpaidVacationDaysLeft,
            daysLeft) && daysLeft,
          newType: true,
        };
      }
    }

    if (vacation.changed('start') || vacation.changed('end')) {
      /* Amount of the vacation days of the previous date */
      const prevDaysLeft = await this.getVacationLength(vacation.previous('start'), vacation.previous('end'));
      /* Amount of the vacation days of the current date */
      const currDaysLeft = await this.getVacationLength(vacation.start, vacation.end);
      const value = Math.abs(currDaysLeft - prevDaysLeft);

      /* If vacation days not equals, then return object, else return previous value */
      if (prevDaysLeft !== currDaysLeft) {
        return {
          ...baseObj,
          value: prevDaysLeft < currDaysLeft
          && this.isResourceHasEnoughDays(resource[baseObj.key], value)
            ? resource[baseObj.key] - value
            : resource[baseObj.key] + value,
        };
      }
    }

    if (vacation.changed('statusId') && +vacation.previous('statusId') !== +vacation.statusId) {

      if (+vacation.statusId === VACATION_STATUSES.APPROVED) {
        return this.vacationCreateRecalculating(baseObj, vacation, resource);
      }

      if (+vacation.statusId === VACATION_STATUSES.NEW || +vacation.statusId
        === VACATION_STATUSES.REJECTED) {
        return this.vacationRejectRecalculating(baseObj, vacation, resource);
      }
    }

    return baseObj;
  }

  /**
   * Recalculating remaining vacation days when REJECT vacation
   * @param baseObj
   * @param vacation
   * @param resource
   * @returns {{value: number}|*}
   */
  async vacationRejectRecalculating(baseObj, vacation, resource) {
    /*  If vacation was rejected, return vacation days back */
    const days = await this.getVacationLength(vacation.start, vacation.end);

    return { ...baseObj, value: +resource[baseObj.key] + days,};
  }

  /**
   * Recalculating remaining vacation days when creating, updating or deleting vacation
   * @param vacation
   * @param resource
   * @param method, recalculating method (CREATE, UPDATE, DELETE),
   * because the recalculations are different
   *
   * Return object: {
   *   key: paidVacationDaysLeft || unpaidVacationDaysLeft,
   *   value: 10 (value of vacation length);
   * }
   */
  recalculateVacationDaysLeft(vacation, resource, method) {
    const { VACATION_RECALCULATE_METHOD } = COMMON;
    const field = this.getResourceField(vacation.type);
    const baseObject = { key: field, value: resource[field], };

    switch (method) {
      /* Recalculate while creating vacation */
      case VACATION_RECALCULATE_METHOD.CREATE: {
        return this.vacationCreateRecalculating(baseObject, vacation, resource);
      }

      /* Recalculate while updating vacation */
      case VACATION_RECALCULATE_METHOD.UPDATE: {
        return this.vacationUpdateRecalculating(baseObject, vacation, resource);
      }

      /* Recalculate while rejecting deleting vacation */
      case VACATION_RECALCULATE_METHOD.REJECT:
      case VACATION_RECALCULATE_METHOD.DELETE: {
        return this.vacationRejectRecalculating(baseObject, vacation, resource);
      }

      default:
        return baseObject;
    }
  }

  /**
   * Update available vacation days for resource
   * @param resourceId
   * @param obj
   */
  async updateVacationDaysForResource(resourceId, obj) {
    const resource = await this.resourceRepository.getEntityById(resourceId);

    if (!resource) {
      throw new EntityNotFoundError('Resource', 'id', resourceId);
    }

    if (!obj.newType) {
      resource[obj.key] = obj.value;
    } else {
      resource.paidVacationDaysLeft = obj.paidVacationDaysLeft;
      resource.unpaidVacationDaysLeft = obj.unpaidVacationDaysLeft;
    }

    resource.updateModel(resource);

    return this.resourceRepository.updateEntity(resource);
  }

  /**
   * Send email when vacation was created
   * @param recipients
   * @param vacationId
   * @param resource
   * 
   * @returns {Promise<void>}
   */
  async sendEmailAboutVacation(recipients, vacationId, resource) {
    const eventLink = LinksFactory.createVacationLink(vacationId);
    const letter = EmailsFactory.createVacationEmail(`${resource.firstName} ${resource.lastName}`, eventLink, recipients);

    /* Send email to all recipients */
    return this.smtpService.sendEmail(letter);
  }

  /**
   * Send email when vacation was approved
   * @param resource
   * @param vacationId
   * @returns {Promise<void>}
   */
  async sendEmailAboutApprovedVacation(resource, vacationId) {
    const eventLink = LinksFactory.createVacationLink(vacationId);
    const resources = await this.resourceRepository.getAll({
      filters: [
        { key: 'roleTitle', value: [ROLES.ADMIN, ROLES.HR, ROLES.PM, ROLES.PML, ROLES.QAL], }],
    });

    const allowedResource = [ROLES.PM, ROLES.PML, ROLES.QAL];
    const filteredResources = resources.items
      .filter((o) => DbHelpers.isResourceOfOffice(o, resource.locationId, ROLES.HR)
        || DbHelpers.isResourceOfOffice(o, resource.locationId, ROLES.ADMIN)
        || allowedResource.includes(o.resourceRole.title.toUpperCase()))
      .map((e) => e.email);

    filteredResources.push(resource.email);
    const recipients = [...new Set(filteredResources)];

    if (recipients && recipients.length) {
      const letter = EmailsFactory.createVacationEmail(`${resource.firstName} ${resource.lastName}`,
        eventLink, recipients, COMMON.VACATION_EMAIL_TYPE.APPROVED);

      /* Send email to all recipients */
      return this.smtpService.sendEmail(letter);
    }

    return null;
  }

  /**
   * Count all weekends between vacation dates
   * @returns {Promise<number>}
   */
  async countWeekends(start, end) {
    return DateHelpers.countWeekends(start, end);
  }

  /**
   * Count all holidays between vacation dates
   * @returns {Promise<*>}
   * @param start
   * @param end
   */
  async countHolidays(start, end) {
    const { items: holidays } = await this.holidayRepository.getAll();

    let parsedHolidays = holidays
      .map((holiday) => {
        const { availableIn } = holiday;
        const locations = availableIn.map((i) => i.id);

        if (locations) {
          return locations.includes(this.resourceLocationId) ? {
            day: holiday.day, month: holiday.month,
          } : null;
        }

        return null;
      })
      .filter((x) => x);

    parsedHolidays = parsedHolidays.filter((item, index, self) => index
      === self.findIndex((t) => t.day === item.day && t.month === item.month));

    const countHolidays = DateHelpers.countHolidays(start, end, parsedHolidays);
    return countHolidays;
  }

  async getRecipientsFromSettings() {
    const { RECIPIENT_LIST: key } = SETTINGS_KEYS;
    const vacationSettings = await this.vacationSettingsRepository.getSettingsByKey(key);
    const resources = (vacationSettings && JSON.parse(vacationSettings.data)) || [];
    const resourceIds = resources.map((x) => x.resourceId).filter((o) => o);

    const resourceById = await this.resourceRepository.getAll({
      filters: [
        {
          key: 'id', value: resourceIds,
        }],
    });

    if (resourceById.items && resourceById.items.length) {
      const emailList = resourceById.items.map((e) => e.email);
      return [...new Set(emailList)];
    }

    return [];
  }
}

module.exports = VacationServiceHandler;