const dayjs = require('dayjs');
const ServiceHandler = require('./serviceHandler');
const { VACATION_STATUSES } = require('../../common/consts');
const { FinderHelpers } = require('../../db/helpers');
const { Helpers } = require('../../common/helpers');

class ScriptHandler extends ServiceHandler {
  /**
   * Save all obtained events to our DB
   */
  saveEventsFromGoogle(events) {
    if (!Array.isArray(events)) return null;

    return events.map(async (item) => {
      const eventName = item.summary || null;
      const parts = eventName && eventName.split('-');
      let vacation = null;

      /**
       * Valid pattern for event name: [John Doe - Paid Some Other Text ]
       * Separator is dash(-)
       * Parts must include event name (resource) and vacation type (paid or unpaid)
       * If vacation type is not specified, it is unpaid by default
       */
      if (parts && parts.length > 1) {
        const resourceName = parts[0].trim().toLowerCase() || eventName;
        /* Find resource by name */
        const resource = await FinderHelpers.findResourceByName(
          this.resourceRepository,
          resourceName,
        );

        /* If resource not found, don't save to the database */
        if (!resource) {
          return null;
        }

        /**
         * Get vacation type from event name.
         * If the type of vacation is indicated incorrectly, it is equivalent to unpaid
         * @type {string}
         */
        const vacationType = parts[1].trim().toLowerCase().includes('paid') ? 'paid' : 'unpaid';
        const end = item.end.dateTime || item.end.date || Date.now();
        const candidate = await this.vacationRepository.getByCalendarId(item.id);

        /* Save to our database */
        vacation = {
          name: Helpers.capitalizeEachWord(eventName),
          type: vacationType,
          description: item.description || null,
          start: item.start.dateTime || item.start.date || Date.now(),
          end: dayjs(end).subtract(1, 'day').format('YYYY-MM-DD'),
          statusId: VACATION_STATUSES.APPROVED,
          resourceId: resource.id || null,
          synced: true,
          eventLink: item.htmlLink,
          gcalendarId: item.id || null,
          approvedByClient: false,
          impactsRevenue: false,
        };

        if (!candidate) {
          return this.vacationRepository.createEntity(vacation);
        }

        return null;
      }

      return null;
    });
  }
}

module.exports = ScriptHandler;