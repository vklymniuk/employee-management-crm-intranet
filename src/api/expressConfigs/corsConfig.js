const { config, env } = require('../../config');
const { cors } = config;

function setCors(origin, callback) {

  if (
    (env.NODE_ENV !== 'production' && !origin)
    || cors.whitelist.some((x) => origin.indexOf(x) !== -1)
  ) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}

const corsOptions = {
  origin: setCors,
  credentials: true,
};

module.exports = corsOptions;