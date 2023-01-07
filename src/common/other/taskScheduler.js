const schedule = require('node-schedule');
const { DateHelpers } = require('../helpers');

const TaskScheduler = {
  self: null,

  getScheduler(tasks, workers) {

    if (this.self) {
      return this.self;
    }

    this.jobs = {};
    this.workers = workers;

    if (Array.isArray(tasks)) {
      tasks.forEach((item) => this.shceduleTask(item));
    }

    this.self = this;

    return this.self;
  },

  shceduleTask(task) {
    const hasInterval = !!task.interval;

    if (!this.workers[task.title]) {
      return;
    }

    const worker = this.workers[task.title].bind(null, task);
    const jobFunc = hasInterval ? () => {
        const job = this.jobs[task.id];

        if (job) {
            job.cancel();
        }

        this.jobs[task.id] = schedule.scheduleJob(task.interval, worker);
      } : worker;

    if (task.startDate && task.startDate > DateHelpers.getCurrentUtc()) {
      const job = this.jobs[task.id];

      if (job) {
        job.cancel();
      }

      this.jobs[task.id] = schedule.scheduleJob(task.startDate, jobFunc);
    } else if (hasInterval) {
        jobFunc();
    }
  },

  cancelTask(task) {
    const job = this.jobs[task.id];

    if (job) {
        job.cancel();
    }

  },
};

module.exports = TaskScheduler;