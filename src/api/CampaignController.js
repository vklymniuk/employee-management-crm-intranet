const ServicesFactory = require('../../services');

async function getCampaigns(req, res, next) {
  try {

    const campaignService = ServicesFactory.createCampaignService();
    const result = await campaignService.getAll();
    res.send(result.items);

  } catch (err) {
    next(err);
  }
}

async function updateCampaign(req, res, next) {
  try {

    const campaignService = ServicesFactory.createCampaignService();
    const result = await campaignService.updateCampaign(req.params.id, req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function createCampaign(req, res, next) {
  try {

    const campaignService = ServicesFactory.createCampaignService();
    const result = await campaignService.createCampaign(req.body);
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function deleteCampaign(req, res, next) {
  try {
    const campaignService = ServicesFactory.createCampaignService();
    await campaignService.deleteCampaignById(req.params.id);
    res.send(204);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCampaigns, deleteCampaign, createCampaign, updateCampaign, };
