class BaseResourceCRUDController {
    constructor(service, idParam) {
      this.service = service;
      this.idParam = idParam;
    }
  
    async createEntity(req, res, next) {
      try {

        const result = await this.service.createEntity(req.body, req.params.id);
        res.send(result);

      } catch (err) {
        next(err);
      }
    }
  
    async getEntities(req, res, next) {
      try {

        const result = await this.service.getEntities(req.params.id);
        res.send(result);

      } catch (err) {
        next(err);
      }
    }
  
    async updateEntity(req, res, next) {
      try {

        const result = await this.service.updateEntity(req.params[this.idParam], req.body);
        res.send(result);

      } catch (err) {
        next(err);
      }
    }
  
    async deleteEntity(req, res, next) {
      try {

        await this.service.deleteEntity(req.params[this.idParam]);
        res.send(204);

      } catch (err) {
        next(err);
      }
    }
}
  
module.exports = BaseResourceCRUDController;