const ServicesFactory = require('../../services');

async function getLocations(req, res, next) {
  try {

    const locationService = ServicesFactory.createLocationService();
    const locations = await locationService.getLocations();
    res.send(locations.items);
    
  } catch (err) {
    next(err);
  }
}

module.exports = { getLocations, };
