const ServicesFactory = require('../../services');

async function getTechLvls(req, res, next) {
  try {

    const techLvlService = ServicesFactory.createTechLvlService();
    const result = await techLvlService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function updateTechLvl(req, res, next) {
  try {

    const techLvlService = ServicesFactory.createTechLvlService();
    const result = await techLvlService.updateTechLvl(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createTechLvl(req, res, next) {
  try {

    const techLvlService = ServicesFactory.createTechLvlService();
    const result = await techLvlService.createTechLevel(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteTechLvl(req, res, next) {
  try {

    const techLvlService = ServicesFactory.createTechLvlService();
    await techLvlService.deleteTechLvlById(req.params.id);
    res.send(204);

  } catch (err) {
    next(err);
  }
}

module.exports = { getTechLvls, deleteTechLvl, createTechLvl, updateTechLvl, };