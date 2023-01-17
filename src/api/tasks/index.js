const { TASKS } = require('../../common/consts');
const birthdayCheckTask = require('./birthdayCheck');
const marketingWorker = require('./marketingWorker');
const emailsAssetsCleaner = require('./assetsCleaner');
const contractDateExpiration = require('./contractDateExpiration');
const ServicesFactories = require('../../services');
const { TaskScheduler, BackgroundWorker } = require('../../common/other');

const workers = {
  [TASKS.BIRTHDAY]: birthdayCheckTask,
  [TASKS.MAILING]: marketingWorker,
  [TASKS.CLEAR_FILES]: emailsAssetsCleaner,
};

const backgroundTasks = {
  [TASKS.CONTRACT_EXPIRATION]: {
    rule: '0 0 10 * * *',
    func: contractDateExpiration,
  },
};

async function initTasks() {
  const tasksService = ServicesFactories.createTaskService();
  const tasks = await tasksService.getAllActive();
  TaskScheduler.getScheduler(tasks, workers);

  // Run background worker
  BackgroundWorker.initWorkers(backgroundTasks);
}

module.exports = initTasks;