const router = require('express').Router();
const { validate } = require('express-validation');
const { ClientController } = require('../controllers');
const { permissionCheckMiddleware } = require('../middlewares');
const { CLAIM_TYPES } = require('../../common/consts');
const clientValidator = require('../schemas/client');
const commonValidator = require('../schemas/common');
const editOnly = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.EDIT_CLIENT],
});

const view = permissionCheckMiddleware({
  claims: [CLAIM_TYPES.VIEW_CLIENT, CLAIM_TYPES.EDIT_CLIENT],
});

router.get('/', view, ClientController.getClients);
router.post('/', editOnly, validate(clientValidator.create), ClientController.createClient,);
router.put('/:id', editOnly, validate(clientValidator.update), ClientController.updateClient,);
router.delete('/:id', editOnly, validate(commonValidator.deleteReq), ClientController.deleteClient,);
router.patch('/:id/addProjects', editOnly, validate(clientValidator.changeProject), ClientController.addProjectToClient,);
router.patch('/:id/removeProjects', editOnly, validate(clientValidator.changeProject), ClientController.removeProjectFromClient,);

module.exports = router;
