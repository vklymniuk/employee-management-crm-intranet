const birthdayTask = require('../tasks/birthdayCheck');
const marketingWorker = require('../tasks/marketingWorker');
const contractDateExpiration = require('../tasks/contractDateExpiration');
const ServicesFactory = require('../../services');

async function contract(req, res, next) {
  try {

    await contractDateExpiration();
    res.set('Content-Type', 'text/html');
    res.status(200).send(Buffer.from('contractExpirationTask executed'));

  } catch (err) {
    next(err);
  }
}

async function birthday(req, res, next) {
  try {

    await birthdayTask();
    res.set('Content-Type', 'text/html');
    res.status(200).send(Buffer.from('birthdayTask executed'));

  } catch (err) {
    next(err);
  }
}

async function marketing(req, res, next) {
  try {

    const result = await marketingWorker();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function redisCache(req, res, next) {
  try {

    const claimService = ServicesFactory.createClaimService();
    const claims = await claimService.getClaims().then((result) => result.items.map((item) => item.name));
    res.send(claims);

  } catch (err) {
    next(err);
  }
}

module.exports = { contract, birthday, marketing, redisCache,};