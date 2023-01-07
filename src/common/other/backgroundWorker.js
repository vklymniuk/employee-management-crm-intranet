const schedule = require('node-schedule');

function initWorkers(tasks) {

  Object.keys(tasks).forEach((key) => {
    const obj = tasks[key];
    schedule.scheduleJob(obj.rule, obj.func);
  });

}

module.exports = { initWorkers, };