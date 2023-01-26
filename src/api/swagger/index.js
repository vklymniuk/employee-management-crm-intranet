const {
    Helpers: { loadYamlFile, swapJSON },
  } = require('../../common/helpers');
  
  const paths = loadYamlFile('paths.yaml', __dirname);
  const schemas = loadYamlFile('schemas.yaml', __dirname);
  const objects = loadYamlFile('objects.yaml', __dirname);
  const securitySchemes = loadYamlFile('securitySchemes.yaml', __dirname);
  const responses = loadYamlFile('responses.yaml', __dirname);
  const parameters = loadYamlFile('parameters.yaml', __dirname);
  
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Intranet-2.0 API',
      description:
        'API description in Markdown. Note: All filters support multidata like array, example: `?projectStatus=2,3,4`',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://intra.manateteam.com',
      },
    ],
    paths: swapJSON(paths),
    components: {
      schemas: { ...schemas, ...objects },
      securitySchemes,
      responses,
      parameters,
    },
  };
  
  module.exports = swaggerDocument;
  