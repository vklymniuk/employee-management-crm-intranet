const { CronHelpers } = require('../../common/helpers');

function getMailingResponse(mailing, mailingRecipients) {
  const result = mailing.toJSON();

  if (result.task) {
    result.startedDate = result.task.startDate;
    result.interval = result.task.interval ? CronHelpers.getIntervalFromCron(result.task.interval) : 0;
    result.progress = result.task.progress;
    result.workerAt = result.task.workedAt;
    result.status = result.task.status;
  }

  result.task = undefined;
  result.taskId = undefined;

  if (mailingRecipients) {
    result.recipientIds = mailingRecipients.rows.map((record) => record.recipientId);
    result.received = mailingRecipients.rows.filter((record) => record.sentAt !== null)
      .map((record) => ({
        recipientId: record.recipientId,
        sentAt: record.sentAt,
      }));
  }

  return result;
}

function getMailingsResponse(mailings) {
  return mailings.map((x) => getMailingResponse(x));
}

module.exports = { getMailingResponse, getMailingsResponse, };