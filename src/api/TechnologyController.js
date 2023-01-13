const ServicesFactory = require('../../services');

async function getTechnologies(req, res, next) {
  try {
    
    const technologyService = ServicesFactory.createTechnologyService();
    const technologies = await technologyService.getTechnologies(req.queryOptions);
    res.send(technologies);

  } catch (err) {
    next(err);
  }
}

async function getTechnology(req, res, next) {
  try {

    const technologyService = ServicesFactory.createTechnologyService();
    const technology = await technologyService.getTechnology(req.params.id);
    res.send(technology);

  } catch (err) {
    next(err);
  }
}

async function createTechnology(req, res, next) {
  try {

    const technologyService = ServicesFactory.createTechnologyService();
    const technology = await technologyService.createTechnology(req.body);
    res.send(technology);

  } catch (err) {
    next(err);
  }
}

async function deleteTechnology(req, res, next) {
  try {

    const technologyService = ServicesFactory.createTechnologyService();
    const result = await technologyService.deleteTechnology(req.params.id);
    res.status(204).send(result);

  } catch (err) {
    next(err);
  }
}

async function updateTechnology(req, res, next) {
  try {

    const technologyService = ServicesFactory.createTechnologyService();
    const technology = await technologyService.updateTechnology(req.params.id, req.body);
    res.send(technology);

  } catch (err) {
    next(err);
  }
}

module.exports = { getTechnologies, getTechnology, createTechnology, updateTechnology, deleteTechnology, };